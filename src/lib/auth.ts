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
  avatar?: string | null;
  nickname?: string | null;
  favoriteColor?: string | null;
  favoriteAnimal?: string | null;
  favoriteGame?: string | null;
  learningStyle?: string | null;
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
    // Parent email login
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
        return { id: user.id, email: user.email, name: user.name ?? undefined, role: "parent", plan: user.plan };
      },
    }),

    // Child PIN login — loads full personalisation
    CredentialsProvider({
      id: "child-pin", name: "Child PIN",
      credentials: { pin: { type: "password" } },
      async authorize(credentials): Promise<ExtendedUser | null> {
        if (!credentials?.pin || credentials.pin.length !== 4) return null;
        const children = await prisma.child.findMany({
          select: { id: true, name: true, nickname: true, age: true, pin: true, parentId: true, avatar: true, favoriteColor: true, favoriteAnimal: true, favoriteGame: true, learningStyle: true, mascotName: true },
        });
        for (const child of children) {
          const valid = await compare(credentials.pin, child.pin);
          if (valid) {
            return {
              id: child.id,
              name: child.name,
              nickname: child.nickname,
              email: `child_${child.id}@kidlearn.internal`,
              role: "child",
              age: child.age,
              parentId: child.parentId,
              avatar: child.avatar,
              favoriteColor: child.favoriteColor,
              favoriteAnimal: child.favoriteAnimal,
              favoriteGame: child.favoriteGame,
              learningStyle: child.learningStyle,
              mascotName: child.mascotName,
            };
          }
        }
        return null;
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
