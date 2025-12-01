import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Dialog } from '../../enums/confirmation-dialog/dialog';
import { FormsModule } from '@angular/forms';
import { ConfirmationDialogService } from './confirmation-dialog.service';
import { Subject, Subscription } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';


@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrl:'./confirmation-dialog.component.scss',
  imports:[ CommonModule , NgbModule, FormsModule],
  standalone:true,
})
export class ConfirmationDialogComponent implements OnInit {
  
  private routerSubscription !: Subscription;

  // @Input() title: string;
  @Input() message: string='';
  @Input() btnOkText: string='';
  @Input() btnCancelText: string='';

  @Input() Dialog!: Dialog
  dialogType = Dialog
  trackingCode:string=""
  description:string=""


  constructor(
    private activeModal: NgbActiveModal,
    private dialogService : ConfirmationDialogService,
    private router : Router,
  ) {}

  ngOnInit() {
    this.backwardBrowserSetting();
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  //for backward button in browser
  backwardBrowserSetting(){
    this.router.events.subscribe( event =>{
      if( event instanceof NavigationStart){
        this.activeModal.dismiss();
      }
    })
  }
  


  //on confirmation modal 
  OnConfirmTransaction(){
    this.activeModal.close({
      confirmed: true,
      trackingCode: this.trackingCode
    });
  }
  OnConfirmCancelTransaction(){
    this.activeModal.close({
      confirmed: true,
      description: this.description
    });
  }

  onConfirm(){
    this.activeModal.close(true);
  }

  onCancle(){
    this.activeModal.close(false);
  }

  // Helper methods for the new HTML structure
  getIconClass(): string {
    switch (this.Dialog) {
      case Dialog.confirmationDelete:
        return 'fa fa-trash';
      case Dialog.confirmAccetTransactionModal:
        return 'fa fa-check-circle';
      case Dialog.cancelTransaction:
        return 'fa fa-times-circle';
      case Dialog.any:
        return 'fa fa-question-circle';
      default:
        return 'fa fa-info-circle';
    }
  }

  getIconContainerClass(): string {
    switch (this.Dialog) {
      case Dialog.confirmationDelete:
        return 'danger';
      case Dialog.confirmAccetTransactionModal:
        return 'success';
      case Dialog.cancelTransaction:
        return 'warning';
      case Dialog.any:
        return 'info';
      default:
        return 'info';
    }
  }

  getPrimaryButtonClass(): string {
    switch (this.Dialog) {
      case Dialog.confirmationDelete:
        return 'btn-danger';
      case Dialog.cancelTransaction:
        return 'btn-warning';
      default:
        return 'btn-primary';
    }
  }
  
}