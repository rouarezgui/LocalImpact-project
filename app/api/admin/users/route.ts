
import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/dal";
import { hasPermission } from "@/features/auth/domain/permissions";
import { authContainer } from "@/features/auth/infrastructure/auth-container";

import type { UserRole } from "@/features/auth/domain/user";

// GET : récupérer la liste des utilisateurs
export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    // Vérifier l'authentification
    if (!currentUser) {
      return NextResponse.json(
        { message: "Vous devez être connecté." },
        { status: 401 }
      );
    }

    // Vérifier la permission USER_VIEW
    if (!hasPermission(currentUser.role, "USER_VIEW")) {
      return NextResponse.json(
        { message: "Accès interdit. Permission ADMIN requise." },
        { status: 403 }
      );
    }

    const users = await authContainer.listUsers.execute();

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Erreur GET admin users :", error);

    return NextResponse.json(
      { message: "Impossible de récupérer les utilisateurs." },
      { status: 500 }
    );
  }
}

// PATCH : modifier le rôle d'un utilisateur
export async function PATCH(request: NextRequest) {
  try {
    // 1. Vérifier l'authentification
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { message: "Vous devez être connecté." },
        { status: 401 }
      );
    }

    // 2. Vérifier la permission ROLE_MANAGE
    if (!hasPermission(currentUser.role, "ROLE_MANAGE")) {
      return NextResponse.json(
        { message: "Accès interdit. Permission ADMIN requise." },
        { status: 403 }
      );
    }

    // 3. Récupérer et vérifier le JSON
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Format JSON invalide." },
        { status: 400 }
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      !("id" in body) ||
      !("role" in body)
    ) {
      return NextResponse.json(
        { message: "ID et rôle obligatoires." },
        { status: 400 }
      );
    }

    const { id, role } = body as {
      id: unknown;
      role: unknown;
    };

    // 4. Valider les données
    const validRoles: UserRole[] = ["USER", "MANAGER", "ADMIN"];

    if (
      typeof id !== "string" ||
      !id.trim() ||
      typeof role !== "string" ||
      !validRoles.includes(role as UserRole)
    ) {
      return NextResponse.json(
        { message: "ID ou rôle invalide." },
        { status: 400 }
      );
    }

    // 5. Modifier le rôle via le Use Case
    // Les contrôles d'existence, d'auto-rétrogradation
    // et du dernier administrateur sont centralisés ici.
    const updatedUser = await authContainer.changeUserRole.execute(
      id,
      role as UserRole,
      currentUser.id
    );

    return NextResponse.json(
      {
        message: "Rôle modifié avec succès.",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    // 6. Gérer les erreurs métier
    if (error instanceof Error) {
      if (error.message === "USER_NOT_FOUND") {
        return NextResponse.json(
          { message: "Utilisateur introuvable." },
          { status: 404 }
        );
      }

      if (error.message === "SELF_ROLE_CHANGE") {
        return NextResponse.json(
          { message: "Vous ne pouvez pas réduire votre propre rôle." },
          { status: 403 }
        );
      }

      if (error.message === "LAST_ADMIN") {
        return NextResponse.json(
          {
            message:
              "Impossible de rétrograder le dernier administrateur.",
          },
          { status: 409 }
        );
      }
    }

    console.error("Erreur PATCH admin users :", error);

    return NextResponse.json(
      { message: "Impossible de modifier le rôle." },
      { status: 500 }
    );
  }
}
