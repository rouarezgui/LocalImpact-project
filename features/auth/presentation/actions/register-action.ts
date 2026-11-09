"use server";

import { redirect } from "next/navigation";

import { registerSchema } from "../schemas/register-schema";
import { authContainer } from "../../infrastructure/auth-container";
import { AuthError } from "../../domain/auth-error";
import type { AuthActionState } from "./auth-action-state";

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Veuillez corriger les champs indiqués.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await authContainer.registerUser.execute(parsed.data);
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: error.message,
      };
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "Cette adresse e-mail est déjà utilisée.",
      };
    }

    console.error("Erreur lors de l'inscription :", error);

    return {
      success: false,
      message: "Une erreur est survenue. Veuillez réessayer.",
    };
  }

  redirect("/login?registered=1");
}

