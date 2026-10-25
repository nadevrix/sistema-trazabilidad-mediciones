import type { Role } from "@prisma/client";
import type { NextAuthConfig } from "next-auth";

/**
 * Config compatible con Edge (middleware).
 * No importar Prisma ni bcrypt acá.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = !!auth?.user;
      const isLogin = pathname === "/login";
      const isAuthApi = pathname.startsWith("/api/auth");

      if (isAuthApi) return true;

      if (isLogin) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", request.nextUrl));
        }
        return true;
      }

      if (!isLoggedIn) return false;

      if (pathname.startsWith("/admin") && auth.user?.role !== "ADMIN") {
        return Response.redirect(new URL("/dashboard", request.nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
