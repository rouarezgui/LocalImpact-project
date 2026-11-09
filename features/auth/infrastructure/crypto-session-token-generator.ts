import { createHash, randomBytes } from "node:crypto";
import type { SessionTokenGenerator } from "../application/ports/session-token-generator";

export class CryptoSessionTokenGenerator implements SessionTokenGenerator {
  generate(): string {
    return randomBytes(32).toString("base64url");
  }

  hash(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }
}
