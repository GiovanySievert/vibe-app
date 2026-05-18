import { z } from 'zod'

import { i18n } from '@src/shared/i18n'

export const deleteAccountSchema = z.object({
  password: z
    .string()
    .min(8, i18n.t('userMenu.deleteAccount.errors.passwordMinLength'))
    .regex(/[A-Z]/, i18n.t('userMenu.deleteAccount.errors.passwordUppercase'))
    .regex(/[a-z]/, i18n.t('userMenu.deleteAccount.errors.passwordLowercase'))
    .regex(/[0-9]/, i18n.t('userMenu.deleteAccount.errors.passwordDigit'))
})

export type DeleteAccountForm = z.infer<typeof deleteAccountSchema>
