export interface CreateSessionData {
  tokenHash: string;
  userId: string;
  expiresAt: Date;
}

export interface SessionRecord {
  id: string;
  tokenHash: string;
  userId: string;
  expiresAt: Date;
}

export interface SessionRepository {
  create(data: CreateSessionData): Promise<SessionRecord>;
  findByTokenHash(tokenHash: string): Promise<SessionRecord | null>;
  deleteById(id: string): Promise<void>;
  deleteExpired(now: Date): Promise<number>;
}
