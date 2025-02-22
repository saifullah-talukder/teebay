import { z } from 'zod'

export const phoneSchema = z
  .string()
  .regex(
    /^(?:\+880|880|0)\d{10}$/,
    'Invalid Bangladeshi phone number. It must start with +880, 880, or 0, followed by 10 digits.'
  )

export const dateSchema = z
  .string()
  .regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/, 'Invalid date format. Must be dd/mm/yyyy.')
  .refine(dateStr => {
    const [day, month, year] = dateStr.split('/').map(Number)
    const date = new Date(year, month - 1, day)
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
  }, 'Invalid date. The date does not exist.')
