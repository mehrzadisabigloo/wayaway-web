import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { Dialog } from '../../enums/confirmation-dialog/dialog';


@Injectable({
  providedIn: 'root',
})
export class ConfirmationDialogService {

  dialogType = Dialog
  constructor(private modalService: NgbModal) { }


  
  
  public confirm(
    dialog: string='any',
    message: string='',
    btnOkText: string = 'باشه',
    btnCancelText: string = 'نه!',
    dialogSize: 'sm'|'lg' = 'lg'): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, { size: dialogSize });
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    modalRef.componentInstance.Dialog = Object.values(this.dialogType).includes(dialog as Dialog)?dialog:null
    return modalRef.result;
  }
  
}
