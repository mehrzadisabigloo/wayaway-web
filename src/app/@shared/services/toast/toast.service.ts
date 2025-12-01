import { Injectable, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];

  success(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    if (!options['classname']) {
      options['classname'] = 'bg-success py-2 mt-2 rounded text-light';
    }
    this.toasts.push({ textOrTpl, ...options });
  }
  error(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    if (!options['classname']) {
      options['classname'] = 'bg-danger py-2 mt-2 rounded text-light';
    }
    this.toasts.push({ textOrTpl, ...options });
  }
  warn(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    if (!options['classname']) {
      options['classname'] = 'bg-light py-2 mt-2 rounded text-dark';
    }
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }
}
