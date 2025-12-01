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
  selector: '[appTimeMask]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeMaskDirective),
      multi: true,
    },
  ],
})
export class TimeMaskDirective implements ControlValueAccessor {
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
  private placeholder = '--:--';

  constructor(private el: ElementRef<HTMLInputElement>) {}

  writeValue(value: any): void {
    const raw = this.extractDigits(value || '');
    const formatted = raw.length ? this.formatMaskedTime(raw) : '';
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
    const formatted = raw.length ? this.formatMaskedTime(raw) : '';

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

    const formatted = raw.length ? this.formatMaskedTime(raw) : '';
    input.value = this.toPersianDigits(formatted);
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
        const formatted = raw.length ? this.formatMaskedTime(raw) : this.toPersianDigits(this.placeholder);
        input.value = formatted;
        this.onChange(raw.length ? this.formatMaskedTime(raw) : '');
        this.setCaretPosition(input, this.getCaretPosForTime(raw.length));
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
      .slice(0, 4);
  }

  private formatMaskedTime(value: string): string {
    let masked = '----';
    for (let i = 0; i < value.length; i++) {
      masked = masked.substring(0, i) + value[i] + masked.substring(i + 1);
    }
    return `${masked.substring(0, 2)}:${masked.substring(2, 4)}`;
  }

  private toPersianDigits(value: string): string {
    return value.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d, 10)]);
  }

  private validateStepwise(value: string): boolean {
    const len = value.length;
    if (len >= 2) {
      const hour = parseInt(value.slice(0, 2), 10);
      if (hour > 23) return false;
    }
    if (len === 4) {
      const minute = parseInt(value.slice(2, 4), 10);
      if (minute > 59) return false;
    }
    return true;
  }

  private setCaretPosition(input: HTMLInputElement, pos: number): void {
    setTimeout(() => {
      input.selectionStart = pos;
      input.selectionEnd = pos;
    });
  }

  private getCaretPosForTime(len: number): number {
    if (len === 0) return 0;
    if (len <= 2) return len;
    return len + 1; // بعد از ':'
  }
}
