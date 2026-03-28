import type { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { prisma } from "./prisma";
import { compare } from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const demoUsers = {
          "user@example.com": {
            id: "client-demo",
            email: "user@example.com",
            name: "Demo User",
            role: "client" as const,
            is_demo: true,
          },
          "agent@example.com": {
            id: "agent-demo",
            email: "agent@example.com",
            name: "Demo Agent",
            role: "agent" as const,
            is_demo: true,
          },
          "admin@example.com": {
            id: "admin-demo",
            email: "admin@example.com",
            name: "Demo Admin",
            role: "admin" as const,
            is_demo: true,
          },
        };

        if (demoUsers[credentials.email as keyof typeof demoUsers]) {
          const demoUser =
            demoUsers[credentials.email as keyof typeof demoUsers];
          if (credentials.password === "123456") {
            return demoUser;
          }
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password,
        );
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          is_demo: user.is_demo,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false;

      await supabaseAdmin.from("users").upsert(
        {
          email: user.email,
          name: user.name,
          avatar_url: user.image,
        },
        { onConflict: "email", ignoreDuplicates: false },
      );
      return true;
    },
    async session({ session }) {
      const email = session.user?.email;
      if (!email) return session;

      const { data } = await supabaseAdmin
        .from("users")
        .select("id, role, theme, is_demo")
        .eq("email", email)
        .single();

      if (data) {
        (session.user as any).id = data.id;

        (session.user as any).role = data.role;

        (session.user as any).theme = data.theme;

        (session.user as any).is_demo = data.is_demo;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user?.email) token.email = user.email;
      return token;
    },
  },
  session: { strategy: "jwt" },
};
