// app/components/AuthStatus.ts
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function AuthStatus(): Promise<{ isAuthenticated: boolean }> {
  const { isAuthenticated } = getKindeServerSession();
  return { isAuthenticated: !!isAuthenticated }; // Ensure it's a boolean
}