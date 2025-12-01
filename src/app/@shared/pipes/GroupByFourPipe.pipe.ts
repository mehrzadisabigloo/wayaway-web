import { Pipe, PipeTransform } from '@angular/core';


/**
 *  123456789090 => 1234 5678 9090 
 */



@Pipe({
  name: 'groupByFour'
})
export class GroupByFourPipe implements PipeTransform {
  transform(value: string | number): string {
    if (!value) return '';

    const str = value.toString().replace(/\s+/g, ''); // حذف فاصله‌ها
    const grouped = str.replace(/(.{4})/g, '$1 ').trim();
    return '\u200E' + grouped; // افزودن LTR mark در ابتدای رشته
  }
}
