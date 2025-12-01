import { Pipe, PipeTransform } from '@angular/core';



/**
 *  1234 => ۱۲۳۴
 */

@Pipe({
  name: 'farsiNumber'
})
export class FarsiNumberPipe implements PipeTransform {
  private farsiDigits = ['۰','۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

  transform(value: string | number): string {
    if (value == null || value === '') return '';

    const str = value.toString();
    let result = '';

    for (let char of str) {
      if (char >= '0' && char <= '9') {
        result += this.farsiDigits[parseInt(char, 10)];
      } else {
        result += char; // برای . یا - یا , یا هر کاراکتر غیرعددی
      }
    }

    return result;
  }
}
