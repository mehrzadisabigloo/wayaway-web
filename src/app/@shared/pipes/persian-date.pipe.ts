import { Pipe, PipeTransform } from '@angular/core';


/**
 *  "2025-01-01" => ۱۴۰۳ دی ۱۱
 */



@Pipe({
  name: 'persianDate',
  standalone: true,
})
export class PersianDatePipe implements PipeTransform {
  transform(
    value: string | Date | null | undefined,
    format: string = 'yyyy/mm/dd'
  ): string {
    if (!value) return '';

    const date = typeof value === 'string' ? new Date(value) : value;

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      calendar: 'persian',
    };

    return new Intl.DateTimeFormat('fa-IR', options).format(date);
  }
}
