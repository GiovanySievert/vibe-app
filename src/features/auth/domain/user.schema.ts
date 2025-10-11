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


export const signInSchema = z.object({
  login: z.string()
    .trim()
    .min(1, "Campo obrigatorio"),
  password: z.string().min(1, "Campo obrigatorio")
});


export const otpSchema = z.object({
  otp: z.string()
    .trim()
    .min(6, "Campo obrigatorio"),
});

export const forgotPasswordEmailStepSchema = z.object({
  email: z.string()
    .trim()
    .min(6, "Campo obrigatorio"),
});


export const forgotPasswordCodeStepSchema = z.object({
  code: z.string()
    .trim()
    .min(6, "Campo obrigatorio"),
  password: z.string()
    .min(8, "Mínimo de 8 caracteres")
    .regex(/[A-Z]/, "Precisa de 1 letra maiúscula")
    .regex(/[a-z]/, "Precisa de 1 letra minúscula")
    .regex(/[0-9]/, "Precisa de 1 dígito"),
});

export type SignUpForm = z.infer<typeof signUpSchema>;
export type SignInForm = z.infer<typeof signInSchema>;
export type OtpForm = z.infer<typeof otpSchema>;
export type ForgotPasswordEmailStepForm = z.infer<typeof forgotPasswordEmailStepSchema>;
export type ForgotPasswordCodeStepForm = z.infer<typeof forgotPasswordCodeStepSchema>;
