"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { authContainer } from "../../infrastructure/auth-container";
import {
  SESSION_COOKIE_NAME,
  deleteSessionCookie,
} from "@/lib/auth/session";

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;

  await authContainer.logoutUser.execute(token);
  await deleteSessionCookie();

  redirect("/login");
}
