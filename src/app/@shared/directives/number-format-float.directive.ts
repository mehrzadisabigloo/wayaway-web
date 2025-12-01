import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';



/**
 *  1234567.89123 => ۱٬۲۳۴٬۵۶۷.۸۹۱
 */

@Directive({
  selector: '[appNumberFormatFloat]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberFormatFloatDirective),
      multi: true,
    },
  ],
})
export class NumberFormatFloatDirective implements ControlValueAccessor {
  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor(private el: ElementRef<HTMLInputElement>) {}

  writeValue(value: any): void {
    this.el.nativeElement.value = this.formatToPersian(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    const raw = input.value
      .replace(/٬/g, '')
      .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
  
    let englishNumber = raw.replace(/[^0-9.]/g, '');
  
    const firstDotIndex = englishNumber.indexOf('.');
    if (firstDotIndex !== -1) {
      englishNumber = englishNumber.slice(0, firstDotIndex + 1) + englishNumber.slice(firstDotIndex + 1).replace(/\./g, '');
    }
  
    // ✅ فقط ۳ رقم اعشار نگه دار
    if (englishNumber.includes('.')) {
      const [intPart, decPart] = englishNumber.split('.');
      englishNumber = intPart + '.' + decPart.slice(0, 3);
    }
  
    this.onChange(englishNumber);
    input.value = this.formatToPersian(englishNumber);
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }

  private formatToPersian(value: string | number): string {
    if (value === null || value === undefined || value === '') return '';
  
    const strValue = value.toString();
  
    // جدا کردن قسمت صحیح و اعشار
    const [integerPart, decimalPart] = strValue.split('.');
  
    // تبدیل قسمت صحیح به عدد و اضافه کردن جداکننده هزارگان
    const intNumber = parseInt(integerPart, 10);
    const formattedInteger = isNaN(intNumber)
      ? integerPart
      : intNumber.toLocaleString('en-US').replace(/,/g, '٬');
  
    // تبدیل ارقام به فارسی قسمت صحیح
    const persianInteger = formattedInteger.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d, 10)]);
  
    if (decimalPart !== undefined) {
      // فقط ۳ رقم اول اعشار رو نگه دار
      const limitedDecimal = decimalPart.slice(0, 3);
  
      // تبدیل ارقام به فارسی قسمت اعشار
      const persianDecimal = limitedDecimal.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d, 10)]);
  
      return `${persianInteger}.${persianDecimal}`;
    } else {
      return persianInteger;
    }
  }
  
}
