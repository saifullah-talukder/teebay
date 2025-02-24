import { format } from 'date-fns'

export function formatDateWithOrdinal(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  const day = dateObj.getDate()

  const getOrdinal = (n: number): string => {
    const rules = new Intl.PluralRules('en', { type: 'ordinal' })
    const suffixes: { [key: string]: string } = {
      one: 'st',
      two: 'nd',
      few: 'rd',
      other: 'th',
    }
    return suffixes[rules.select(n)]
  }

  const dayWithOrdinal = `${day}${getOrdinal(day)}`
  const monthAndYear = format(dateObj, 'MMMM yyyy')
  return `${dayWithOrdinal} ${monthAndYear}`
}

export const getDateFromSlashSeparatedString = (dateStr: string) => {
  const [day, month, year] = dateStr.split('/').map(Number)
  return new Date(year, month - 1, day)
}
