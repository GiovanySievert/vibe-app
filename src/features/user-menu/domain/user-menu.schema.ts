import { z, } from "zod";

export const deleteAccountSchema = z.object({
  password: z.string()
    .min(8, "mínimo de 8 caracteres")
    .regex(/[A-Z]/, "precisa de 1 letra maiúscula")
    .regex(/[a-z]/, "precisa de 1 letra minúscula")
    .regex(/[0-9]/, "precisa de 1 dígito"),
});

export type DeleteAccountForm = z.infer<typeof deleteAccountSchema>;
