import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Adresse e-mail invalide.")
    .max(255, "Adresse e-mail trop longue.")
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(1, "Le mot de passe est obligatoire."),
});

export type LoginSchemaInput = z.infer<typeof loginSchema>;
