import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

interface ExtendedUser {
  id: string; email: string; name?: string;
  role: "parent" | "child";
  plan?: string; age?: number; parentId?: string;
  avatar?: string | null; nickname?: string | null;
  favoriteColor?: string | null; favoriteAnimal?: string | null;
  favoriteGame?: string | null; learningStyle?: string | null;
  mascotName?: string | null;
}

declare module "next-auth" {
  interface Session { user: ExtendedUser & { id: string }; }
}
declare module "next-auth/jwt" {
  interface JWT {
    role?: string; plan?: string; age?: number; parentId?: string;
    avatar?: string | null; nickname?: string | null;
    favoriteColor?: string | null; favoriteAnimal?: string | null;
    favoriteGame?: string | null; learningStyle?: string | null;
    mascotName?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/login", error: "/login" },
  providers: [
    // ── Parent email login ─────────────────────────────────────────────────────
    CredentialsProvider({
      id: "credentials", name: "Email & Password",
      credentials: { email: { type: "email" }, password: { type: "password" } },
      async authorize(credentials): Promise<ExtendedUser | null> {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
        if (!user) return null;
        const valid = await compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;
        if (!user.emailVerified) throw new Error("EMAIL_NOT_VERIFIED");
        return { id: user.id, email: user.email, name: user.name ?? undefined, role: "parent", plan: user.plan };
      },
    }),

    // ── Child PIN login ────────────────────────────────────────────────────────
    CredentialsProvider({
      id: "child-pin", name: "Child PIN",
      credentials: { childId: { type: "text" }, pin: { type: "password" } },
      async authorize(credentials): Promise<ExtendedUser | null> {
        if (!credentials?.pin || credentials.pin.length !== 4 || !credentials?.childId) return null;
        // Look up the specific child by ID — PIN is scoped to one child only
        const child = await prisma.child.findUnique({
          where: { id: credentials.childId },
          select: {
            id: true, name: true, nickname: true, age: true,
            pin: true, parentId: true, avatar: true,
            favoriteColor: true, favoriteAnimal: true,
            favoriteGame: true, learningStyle: true, mascotName: true,
          },
        });

        if (!child) return null;

        // Compare PIN against only THIS child — completely safe across families
        const valid = await compare(credentials.pin, child.pin);
        if (!valid) return null;

        const parent = await prisma.user.findUnique({ where: { id: child.parentId }, select: { plan: true } });
        return {
          id: child.id, name: child.name, nickname: child.nickname,
          email: `child_${child.id}@flinchi.internal`,
          role: "child", age: child.age, parentId: child.parentId,
          plan: parent?.plan ?? "FREE",
          avatar: child.avatar, favoriteColor: child.favoriteColor,
          favoriteAnimal: child.favoriteAnimal, favoriteGame: child.favoriteGame,
          learningStyle: child.learningStyle, mascotName: child.mascotName,
        };
      },
    }),

    // ── Parent → Child switch (no PIN needed, validates parentId ownership) ───
    CredentialsProvider({
      id: "parent-switch", name: "Parent Switch to Child",
      credentials: {
        childId:  { type: "text" },
        parentId: { type: "text" },
      },
      async authorize(credentials): Promise<ExtendedUser | null> {
        if (!credentials?.childId || !credentials?.parentId) return null;

        const child = await prisma.child.findUnique({
          where: { id: credentials.childId },
          select: {
            id: true, name: true, nickname: true, age: true,
            parentId: true, avatar: true, favoriteColor: true,
            favoriteAnimal: true, favoriteGame: true,
            learningStyle: true, mascotName: true,
          },
        });

        // Only allow if this child actually belongs to the requesting parent
        if (!child || child.parentId !== credentials.parentId) return null;

        const parent = await prisma.user.findUnique({ where: { id: child.parentId }, select: { plan: true } });
        return {
          id: child.id, name: child.name, nickname: child.nickname,
          email: `child_${child.id}@flinchi.internal`,
          role: "child", age: child.age, parentId: child.parentId,
          plan: parent?.plan ?? "FREE",
          avatar: child.avatar, favoriteColor: child.favoriteColor,
          favoriteAnimal: child.favoriteAnimal, favoriteGame: child.favoriteGame,
          learningStyle: child.learningStyle, mascotName: child.mascotName,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as ExtendedUser;
        token.role          = u.role;
        token.plan          = u.plan;
        token.age           = u.age;
        token.parentId      = u.parentId;
        token.avatar        = u.avatar;
        token.nickname      = u.nickname;
        token.favoriteColor  = u.favoriteColor;
        token.favoriteAnimal = u.favoriteAnimal;
        token.favoriteGame   = u.favoriteGame;
        token.learningStyle  = u.learningStyle;
        token.mascotName     = u.mascotName;
      }
      return token;
    },
    async session({ session, token }) {
      const u = session.user as ExtendedUser;
      u.id            = token.sub ?? "";
      u.role          = (token.role as "parent" | "child") ?? "parent";
      u.plan          = token.plan;
      u.age           = token.age;
      u.parentId      = token.parentId;
      u.avatar        = token.avatar;
      u.nickname      = token.nickname;
      u.favoriteColor  = token.favoriteColor;
      u.favoriteAnimal = token.favoriteAnimal;
      u.favoriteGame   = token.favoriteGame;
      u.learningStyle  = token.learningStyle;
      u.mascotName     = token.mascotName;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
