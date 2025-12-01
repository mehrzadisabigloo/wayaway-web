import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { ToastService } from './toast.service';
import { CommonModule } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-toasts',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  standalone:true,
  imports:[CommonModule,NgbToastModule],
  host: { '[class.ngb-toasts]': 'true' },
})
export class ToastComponent {
  constructor(public toastService: ToastService, private chRef: ChangeDetectorRef) {
    let that = this;
    setInterval(() => {
      if (that.toastService.toasts.length > 0) {
        that.chRef.detectChanges();
      }
    }, 1000);
  }

  isTemplate(toast: any) {
    return toast.textOrTpl instanceof TemplateRef;
  }
}
