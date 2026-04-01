import type { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "./mongodb";
import { User } from "./models";
import { IUserLean } from "@/types";

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

        await connectDB();

        const dbUser = await User.findOne({
          email: credentials.email,
          deleted_at: null,
        }).select("+password");

        if (!dbUser?.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          dbUser.password,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: dbUser._id.toString(),
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role as "client" | "agent" | "admin",
          is_demo: dbUser.is_demo,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false;

      await connectDB();

      await User.findOneAndUpdate(
        { email: user.email },
        {
          $set: {
            name: user.name ?? undefined,
            avatar_url: typeof user.image === "string" ? user.image : undefined,
          },
          $setOnInsert: {
            role: "client",
            theme: "light",
            is_demo: false,
          },
        },
        { upsert: true, new: true },
      );

      return true;
    },
    async session({ session }) {
      const email = session.user?.email;
      if (!email) return session;

      await connectDB();

      const dbUser = await User.findOne({
        email,
        deleted_at: null,
      }).lean<IUserLean | null>();
      if (dbUser) {
        (session.user as { id?: string }).id = String(dbUser._id);
        (session.user as { role?: string }).role = dbUser.role;
        (session.user as { theme?: string }).theme = dbUser.theme;
        (session.user as { is_demo?: boolean }).is_demo = Boolean(
          dbUser.is_demo,
        );
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user?.email) token.email = user.email;
      return token;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;

      return baseUrl;
    },
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-key-change-in-production",
};
