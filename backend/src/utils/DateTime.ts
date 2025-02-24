import { differenceInDays, addDays, isSameDay } from 'date-fns'

type DateInput = Date | string

export function calculateDaysBetween(startDate: DateInput, endDate: DateInput): number {
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (isSameDay(start, end)) {
    return 1
  }

  return differenceInDays(addDays(end, 1), start)
}

export function getDateFromSlashSeparatedString(dateStr: string) {
  const [day, month, year] = dateStr.split('/').map(Number)
  return new Date(year, month - 1, day)
}
