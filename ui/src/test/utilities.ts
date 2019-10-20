import {format} from "date-fns";

export function getDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd HH:mm:ss:SSS')
}
