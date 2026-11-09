"use server";

import { redirect } from "next/navigation";

import { loginSchema } from "../schemas/login-schema";
import { authContainer } from "../../infrastructure/auth-container";
import { AuthError } from "../../domain/auth-error";
import { createSessionCookie } from "@/lib/auth/session";
import type { AuthActionState } from "./auth-action-state";

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Veuillez vérifier les informations saisies.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await authContainer.loginUser.execute(parsed.data);

    await createSessionCookie(
      result.sessionToken,
      result.expiresAt
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: error.message,
      };
    }

    console.error("Erreur lors de la connexion :", error);

    return {
      success: false,
      message: "Une erreur est survenue. Veuillez réessayer.",
    };
  }

  redirect("/");
}
