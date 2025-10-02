import { z, } from "zod";

export const signUpSchema = z.object({
  username: z.string()
    .trim()
    .min(2, "username muito curto"),
  email: z.string()
    .trim()
    .toLowerCase()
    .email("E-mail inválido"),
  password: z.string()
    .min(8, "Mínimo de 8 caracteres")
    .regex(/[A-Z]/, "Precisa de 1 letra maiúscula")
    .regex(/[a-z]/, "Precisa de 1 letra minúscula")
    .regex(/[0-9]/, "Precisa de 1 dígito"),
});

export type SignUpForm = z.infer<typeof signUpSchema>;
