import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(100, "Le nom est trop long."),

  email: z
    .string()
    .trim()
    .email("Adresse e-mail invalide.")
    .max(255, "Adresse e-mail trop longue.")
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
    .regex(/[A-Z]/, "Ajoutez au moins une majuscule.")
    .regex(/[a-z]/, "Ajoutez au moins une minuscule.")
    .regex(/[0-9]/, "Ajoutez au moins un chiffre."),
});

export type RegisterSchemaInput = z.infer<typeof registerSchema>;
