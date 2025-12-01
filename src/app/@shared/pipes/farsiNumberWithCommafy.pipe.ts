import { Pipe, PipeTransform } from '@angular/core';

/**
 *  1234567=> ۱٬۲۳۴٬۵۶۷
 */


@Pipe({
  name: 'persianNumberCommafy'
})
export class farsiNumberWithCommafyPipe implements PipeTransform {
  transform(value: string | number): string {
    if (value === null || value === undefined || value === '') return '';

    // حذف فاصله‌ها و جداکننده‌های قبلی
    let str = value.toString().replace(/٬/g, '').replace(/\s/g, '');

    // جدا کردن عدد صحیح و اعشار
    const [intPart, decimalPart] = str.split('.');

    // تبدیل قسمت صحیح به فارسی با جداکننده
    const formattedInt = this.toPersianWithCommas(intPart);

    // تبدیل قسمت اعشار به فارسی (بدون جداکننده)
    const formattedDecimal = decimalPart
      ? '٫' + decimalPart.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d, 10)])
      : '';

    return formattedInt + formattedDecimal;
  }

  private toPersianWithCommas(value: string): string {
    // حذف هر چیزی که عدد نیست
    const cleaned = value.replace(/\D/g, '');

    if (!cleaned) return '';

    // اضافه کردن جداکننده هزارگان انگلیسی، بعد تبدیل به فارسی
    const withCommas = parseInt(cleaned, 10).toLocaleString('en-US');
    const persianNumber = withCommas
      .replace(/,/g, '٬')
      .replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d, 10)]);

    return persianNumber;
  }
}
