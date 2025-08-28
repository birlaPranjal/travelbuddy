import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
    isNewUser?: boolean;
  }

  interface Session {
    user: {
      _id: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
      isNewUser?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
    isNewUser?: boolean;
  }
} 