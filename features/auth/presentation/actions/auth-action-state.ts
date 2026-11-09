export type AuthActionState = {
  success: boolean;
  message?: string;
  errors?: Partial<
    Record<"name" | "email" | "password", string[]>
  >;
};
