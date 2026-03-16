import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

interface ExtendedUser {
  id: string;
  email: string;
  name?: string;
  role: "parent" | "child";
  plan?: string;
  age?: number;
  parentId?: string;
  avatar?: string | null;
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser & { id: string };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    plan?: string;
    age?: number;
    parentId?: string;
    avatar?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<ExtendedUser | null> {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user) return null;

        const valid = await compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: "parent",
          plan: user.plan,
        };
      },
    }),

    CredentialsProvider({
      id: "child-pin",
      name: "Child PIN",
      credentials: {
        pin: { label: "PIN", type: "password" },
      },
      async authorize(credentials): Promise<ExtendedUser | null> {
        if (!credentials?.pin || credentials.pin.length !== 4) return null;

        const children = await prisma.child.findMany({
          select: { id: true, name: true, age: true, pin: true, parentId: true, avatar: true },
        });

        for (const child of children) {
          const valid = await compare(credentials.pin, child.pin);
          if (valid) {
            return {
              id: child.id,
              name: child.name,
              email: `child_${child.id}@kidlearn.internal`,
              role: "child",
              age: child.age,
              parentId: child.parentId,
              avatar: child.avatar,
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
        token.role = u.role;
        token.plan = u.plan;
        token.age = u.age;
        token.parentId = u.parentId;
        token.avatar = u.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      (session.user as ExtendedUser).id = token.sub ?? "";
      (session.user as ExtendedUser).role = (token.role as "parent" | "child") ?? "parent";
      (session.user as ExtendedUser).plan = token.plan;
      (session.user as ExtendedUser).age = token.age;
      (session.user as ExtendedUser).parentId = token.parentId;
      (session.user as ExtendedUser).avatar = token.avatar;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
