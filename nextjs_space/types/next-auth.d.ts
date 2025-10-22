
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    username?: string;
    accessToken?: string;
    refreshToken?: string;
  }

  interface Session {
    accessToken?: string;
    user: {
      id: string;
      email: string;
      name: string;
      username?: string;
    };
  }
}
