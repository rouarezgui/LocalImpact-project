import type { SessionRepository } from "../ports/session-repository";
import type { SessionTokenGenerator } from "../ports/session-token-generator";

export class LogoutUser {
  constructor(
    private readonly sessions: SessionRepository,
    private readonly tokenGenerator: SessionTokenGenerator
  ) {}

  async execute(token: string | null): Promise<void> {
    if (!token) return;

    const tokenHash = this.tokenGenerator.hash(token);
    const session = await this.sessions.findByTokenHash(tokenHash);

    if (session) {
      await this.sessions.deleteById(session.id);
    }
  }
}
