import { AuthError } from "../../domain/auth-error";
import type { AuthUser } from "../../domain/user";
import type { UserRepository } from "../ports/user-repository";
import type { SessionRepository } from "../ports/session-repository";
import type { SessionTokenGenerator } from "../ports/session-token-generator";

export class VerifySession {
  constructor(
    private readonly sessions: SessionRepository,
    private readonly users: UserRepository,
    private readonly tokenGenerator: SessionTokenGenerator
  ) {}

  async execute(token: string): Promise<AuthUser> {
    if (!token) {
      throw new AuthError("UNAUTHENTICATED", "Authentification requise.");
    }

    const tokenHash = this.tokenGenerator.hash(token);
    const session = await this.sessions.findByTokenHash(tokenHash);

    if (!session) {
      throw new AuthError("UNAUTHENTICATED", "Session invalide.");
    }

    if (session.expiresAt <= new Date()) {
      await this.sessions.deleteById(session.id);
      throw new AuthError("SESSION_EXPIRED", "Votre session a expiré.");
    }

    const user = await this.users.findById(session.userId);

    if (!user) {
      await this.sessions.deleteById(session.id);
      throw new AuthError("UNAUTHENTICATED", "Utilisateur introuvable.");
    }

    return user;
  }
}
