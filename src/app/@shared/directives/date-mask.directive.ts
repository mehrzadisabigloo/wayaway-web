import {
  Directive,
  ElementRef,
  HostListener,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Directive({
  selector: '[appDateMask]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateMaskDirective),
      multi: true,
    },
  ],
})
export class DateMaskDirective implements ControlValueAccessor {
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
  private placeholder = '----/--/--';

  constructor(private el: ElementRef<HTMLInputElement>) {}

  // مقدار بیرونی رو داخل input ست می‌کنه
  writeValue(value: any): void {
    const raw = this.extractDigits(value || '');
    const formatted = raw.length ? this.formatMaskedDate(raw) : '';
    this.el.nativeElement.value = this.toPersianDigits(formatted);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  @HostListener('focus')
  onFocus(): void {
    const input = this.el.nativeElement;
    if (!this.extractDigits(input.value).length) {
      input.value = this.toPersianDigits(this.placeholder);
      this.setCaretPosition(input, 0);
    }
  }

  @HostListener('blur')
  onBlur(): void {
    const input = this.el.nativeElement;
    const raw = this.extractDigits(input.value);
    const formatted = raw.length ? this.formatMaskedDate(raw) : '';

    if (input.value === this.toPersianDigits(this.placeholder)) {
      input.value = '';
      this.onChange('');
    } else {
      this.onChange(formatted);
    }

    this.onTouched();
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let raw = this.extractDigits(input.value);

    if (!this.validateStepwise(raw)) {
      raw = raw.slice(0, -1);
    }

    const formatted = raw.length ? this.formatMaskedDate(raw) : '';
    input.value = this.toPersianDigits(formatted);

    // همیشه مقدار رو به فرم بفرستیم
    this.onChange(formatted);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const input = this.el.nativeElement;

    if (event.ctrlKey && event.key === 'a') {
      event.preventDefault();
      input.select();
      return;
    }

    if (event.key === 'Backspace') {
      event.preventDefault();

      let raw = this.extractDigits(input.value);

      if (raw.length > 0) {
        raw = raw.slice(0, -1);
        const formatted = raw.length ? this.formatMaskedDate(raw) : this.toPersianDigits(this.placeholder);
        input.value = formatted;
        this.onChange(raw.length ? this.formatMaskedDate(raw) : '');
        this.setCaretPosition(input, this.getCaretPosForDate(raw.length));
      } else {
        input.value = this.toPersianDigits(this.placeholder);
        this.onChange('');
        this.setCaretPosition(input, 0);
      }
    }
  }

  // =============== Helpers ===============
  private extractDigits(value: string): string {
    return value
      .replace(/[^\d۰-۹]/g, '')
      .replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
      .slice(0, 8);
  }

  private formatMaskedDate(value: string): string {
    let masked = '--------';
    for (let i = 0; i < value.length; i++) {
      masked = masked.substring(0, i) + value[i] + masked.substring(i + 1);
    }
    return `${masked.substring(0, 4)}/${masked.substring(4, 6)}/${masked.substring(6, 8)}`;
  }

  private toPersianDigits(value: string): string {
    return value.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d, 10)]);
  }

  private validateStepwise(value: string): boolean {
    const len = value.length;
    if (len >= 2) {
      const prefix = value.slice(0, 2);
      if (prefix !== '13' && prefix !== '14') return false;
    }
    if (len >= 6) {
      const month = parseInt(value.slice(4, 6), 10);
      if (month < 1 || month > 12) return false;
    }
    if (len === 8) {
      const day = parseInt(value.slice(6, 8), 10);
      if (day < 1 || day > 31) return false;
    }
    return true;
  }

  private setCaretPosition(input: HTMLInputElement, pos: number): void {
    setTimeout(() => {
      input.selectionStart = pos;
      input.selectionEnd = pos;
    });
  }

  private getCaretPosForDate(len: number): number {
    if (len === 0) return 0;
    if (len <= 4) return len;
    if (len <= 6) return len + 1; // برای '/'
    return len + 2; // دو تا '/'
  }
}
