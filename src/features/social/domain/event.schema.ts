import { z } from 'zod'

import { i18n } from '@src/shared/i18n'

export const createEventSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, i18n.t('social.createEvent.errors.nameTooShort'))
    .max(60, i18n.t('social.createEvent.errors.nameTooLong')),
  date: z
    .string()
    .trim()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, i18n.t('social.createEvent.errors.invalidDate'))
    .refine((val) => {
      const [day, month, year] = val.split('/').map(Number)
      const date = new Date(year, month - 1, day)
      return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    }, i18n.t('social.createEvent.errors.invalidDate'))
    .refine((val) => {
      const [day, month, year] = val.split('/').map(Number)
      const date = new Date(year, month - 1, day)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return date >= today
    }, i18n.t('social.createEvent.errors.invalidDate')),
  time: z
    .string()
    .trim()
    .regex(/^\d{2}:\d{2}$/, i18n.t('social.createEvent.errors.invalidTime'))
    .refine((val) => {
      const [hours, minutes] = val.split(':').map(Number)
      return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59
    }, i18n.t('social.createEvent.errors.invalidTime')),
  description: z.string().max(300, i18n.t('social.createEvent.errors.descriptionTooLong'))
})

export type CreateEventForm = z.infer<typeof createEventSchema>
