import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role: "SUPER_ADMIN" | "COMPANY" | "CLIENT";
  password: string;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = (await prisma.user.findUnique({
          where: { email: credentials.email },
        })) as ExtendedUser | null;

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);

        // Only allow super admins to login here
        if (!isValid || user.role !== "SUPER_ADMIN") return null;

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const extendedUser = user as ExtendedUser;
        token.role = extendedUser.role;
        token.id = extendedUser.id;
      }
      return token;
    },
async session({ session, token }) {
  if (session.user) {
    session.user.id = token.sub as string;

    // Convert token.role to uppercase string to match Prisma enum values
    const role = (token.role as string | undefined)?.toUpperCase();

    // Validate and assign only if role is one of the allowed enum values
    if (role === "SUPER_ADMIN" || role === "COMPANY" || role === "CLIENT") {
      session.user.role = role as "SUPER_ADMIN" | "COMPANY" | "CLIENT";
    } else {
      // Fallback to CLIENT if role is missing or invalid
      session.user.role = "CLIENT";
    }
  }
  return session;
},
  },
  pages: {
    signIn: "/admin/login",
  },
};
