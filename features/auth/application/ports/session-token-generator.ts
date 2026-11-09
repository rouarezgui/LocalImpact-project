export interface SessionTokenGenerator {
  generate(): string;
  hash(token: string): string;
}
