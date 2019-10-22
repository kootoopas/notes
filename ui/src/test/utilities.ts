import {format} from 'date-fns'
// @ts-ignore
import Spy = jasmine.Spy;

export function getDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd HH:mm:ss:SSS')
}

export const asSpy = f => f as Spy
