import { z } from 'zod'

export const createEventSchema = z.object({
  name: z.string().trim().min(2, 'Nome muito curto').max(60, 'Nome muito longo'),
  date: z
    .string()
    .trim()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Data inválida')
    .refine((val) => {
      const [day, month, year] = val.split('/').map(Number)
      const date = new Date(year, month - 1, day)
      return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    }, 'Data inválida')
    .refine((val) => {
      const [day, month, year] = val.split('/').map(Number)
      const date = new Date(year, month - 1, day)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return date >= today
    }, 'Data inválida'),
  time: z
    .string()
    .trim()
    .regex(/^\d{2}:\d{2}$/, 'Hora inválida')
    .refine((val) => {
      const [hours, minutes] = val.split(':').map(Number)
      return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59
    }, 'Hora inválida'),
  description: z.string().max(300, 'Descrição muito longa')
})

export type CreateEventForm = z.infer<typeof createEventSchema>
