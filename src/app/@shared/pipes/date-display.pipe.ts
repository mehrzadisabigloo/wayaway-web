import { Pipe, PipeTransform } from '@angular/core';


/**
 * 
 * <!-- انگلیسی (پیش‌فرض) -->
 * <span>{{ someDate | dateDisplay }}</span>
 * 
 *   • اگر امروز باشد → "Today"
 *   • اگر دیروز باشد → "Yesterday"
 *   • در غیر این صورت → YYYY/MM/DD (مثال: 2025/04/05)
 * 
 * <!-- فارسی -->
 * <span>{{ someDate | dateDisplay: 'fa' }}</span>
 * 
 *   • اگر امروز باشد → "امروز"
 *   • اگر دیروز باشد → "دیروز"
 *   • در غیر این صورت → YYYY/MM/DD (مثال: 2025/04/05)
 * 
 */


@Pipe({
  name: 'dateDisplay',
  standalone: true,
})
export class DateDisplayPipe implements PipeTransform {
  transform(value: unknown, lang: 'en' | 'fa' = 'en'): string | null {
    if (typeof value !== 'string') {
      return null;
    }

    const inputDate = new Date(value);
    if (isNaN(inputDate.getTime())) {
      return lang === 'fa' ? 'تاریخ نامعتبر' : 'Invalid Date';
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = inputDate.toDateString() === today.toDateString();
    const isYesterday = inputDate.toDateString() === yesterday.toDateString();

    if (isToday) {
      return lang === 'fa' ? 'امروز' : 'Today';
    }
    if (isYesterday) {
      return lang === 'fa' ? 'دیروز' : 'Yesterday';
    }

    // فرمت YYYY/MM/DD
    const year = inputDate.getFullYear();
    const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
    const day = inputDate.getDate().toString().padStart(2, '0');

    return `${year}/${month}/${day}`;
  }
}
