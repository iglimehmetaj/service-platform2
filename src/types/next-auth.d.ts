// src/types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "SUPER_ADMIN" | "COMPANY" | "CLIENT";
      companyId?: string | null; // Add companyId to the session user
    } & DefaultSession["user"];
    accessToken?: string;
  }

  interface User {
    id: string;
    role: "SUPER_ADMIN" | "COMPANY" | "CLIENT";
    companyId?: string | null; // Add companyId to the user
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "SUPER_ADMIN" | "COMPANY" | "CLIENT";
    companyId?: string | null; // Add companyId to the JWT
    accessToken?: string;
  }
}
