import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


/**
 * <input
 * ngbDatepicke>
 * 
 *  2025-04-05 => 2025/04/05
 */

@Injectable({
  providedIn: 'root',
})
export class DateFormatterService extends NgbDateParserFormatter {
  format(date: NgbDateStruct | null): string {
    return date
      ? `${date.year}/${String(date.month).padStart(2, '0')}/${String(date.day).padStart(2, '0')}`
      : '';
  }

  parse(value: string): NgbDateStruct | null {
    const parts = value?.split('/');
    if (parts?.length === 3) {
      return { year: +parts[0], month: +parts[1], day: +parts[2] };
    }
    return null;
  }
}
