import { z, } from "zod";

export const deleteAccountSchema = z.object({
  password: z.string()
    .min(8, "Mínimo de 8 caracteres")
    .regex(/[A-Z]/, "Precisa de 1 letra maiúscula")
    .regex(/[a-z]/, "Precisa de 1 letra minúscula")
    .regex(/[0-9]/, "Precisa de 1 dígito"),
});

export type DeleteAccountForm = z.infer<typeof deleteAccountSchema>;
