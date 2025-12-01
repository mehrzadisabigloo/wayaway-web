import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


/**
 *  1234567 => ۱۲۳۴۵۶۷
 */


@Directive({
  selector: '[appNumberFormat]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberFormatDirective),
      multi: true,
    },
  ],
})
export class NumberFormatDirective implements ControlValueAccessor {
  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor(private el: ElementRef<HTMLInputElement>) {}

  writeValue(value: any): void {
    this.el.nativeElement.value = this.toPersianDigits(value?.toString() || '');
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
      .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
      .replace(/\D/g, ''); // فقط اعداد انگلیسی خام

    this.onChange(raw); // ارسال به فرم

    input.value = this.toPersianDigits(raw); // نمایش در input
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }

  private toPersianDigits(value: string): string {
    return value.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d, 10)]);
  }
}
