import { format, getDayOfYear } from "date-fns";

export function formatCustomDate(date: Date): string {
  // Format: yy.doy.hh.mm.ss.SSS
  // date-fns 'DDD' is day of year with leading zeros (001, 365)
  return format(date, "yy.DDD.HH.mm.ss.SSS");
}

export function getRelativeTime(amount: number, unit: 'minutes' | 'hours' | 'days'): Date {
  const now = new Date();
  switch (unit) {
    case 'minutes':
      return new Date(now.getTime() - amount * 60 * 1000);
    case 'hours':
      return new Date(now.getTime() - amount * 60 * 60 * 1000);
    case 'days':
      return new Date(now.getTime() - amount * 24 * 60 * 60 * 1000);
    default:
      return now;
  }
}
