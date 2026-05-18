import { z } from 'zod'

import { i18n } from '@src/shared/i18n'

const passwordRules = () =>
  z
    .string()
    .min(8, i18n.t('auth.errors.passwordMinLength'))
    .regex(/[A-Z]/, i18n.t('auth.errors.passwordUppercase'))
    .regex(/[a-z]/, i18n.t('auth.errors.passwordLowercase'))
    .regex(/[0-9]/, i18n.t('auth.errors.passwordDigit'))

export const buildSignUpEmailSchema = () =>
  z.object({
    email: z.string().trim().toLowerCase().email(i18n.t('auth.errors.invalidEmail')),
    password: passwordRules()
  })

export const buildSignUpProfileSchema = () =>
  z.object({
    name: z.string().trim().min(2, i18n.t('auth.errors.nameMinLength')),
    username: z.string().trim().min(2, i18n.t('auth.errors.usernameMinLength'))
  })

export const buildSignUpSchema = () => buildSignUpEmailSchema().merge(buildSignUpProfileSchema())

export const buildSignInSchema = () =>
  z.object({
    login: z.string().trim().min(1, i18n.t('auth.errors.fieldRequired')),
    password: z.string().min(1, i18n.t('auth.errors.fieldRequired'))
  })

export const buildOtpSchema = () =>
  z.object({
    otp: z.string().trim().min(6, i18n.t('auth.errors.fieldRequired'))
  })

export const buildForgotPasswordEmailStepSchema = () =>
  z.object({
    email: z.string().trim().min(1, i18n.t('auth.errors.fieldRequired')).email(i18n.t('auth.errors.invalidEmail'))
  })

export const buildForgotPasswordCodeStepSchema = () =>
  z.object({
    code: z.string().trim().min(6, i18n.t('auth.errors.fieldRequired')),
    password: passwordRules()
  })

export type SignUpEmailForm = z.infer<ReturnType<typeof buildSignUpEmailSchema>>
export type SignUpProfileForm = z.infer<ReturnType<typeof buildSignUpProfileSchema>>
export type SignUpForm = z.infer<ReturnType<typeof buildSignUpSchema>>
export type SignInForm = z.infer<ReturnType<typeof buildSignInSchema>>
export type OtpForm = z.infer<ReturnType<typeof buildOtpSchema>>
export type ForgotPasswordEmailStepForm = z.infer<ReturnType<typeof buildForgotPasswordEmailStepSchema>>
export type ForgotPasswordCodeStepForm = z.infer<ReturnType<typeof buildForgotPasswordCodeStepSchema>>
