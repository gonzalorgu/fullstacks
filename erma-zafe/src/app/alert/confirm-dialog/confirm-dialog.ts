import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { ConfirmService } from '../../services/confirm/confirm';

@Component({
  selector: 'app-confirm-dialog',
  imports: [CommonModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms', style({ opacity: 0 }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ]
})
export class ConfirmDialog {

  confirmService = inject(ConfirmService);

  confirm() {
    const dialog = this.confirmService.dialog();
    if (dialog) {
      dialog.onConfirm();
      this.confirmService.close();
    }
  }

  cancel() {
    const dialog = this.confirmService.dialog();
    if (dialog) {
      dialog.onCancel();
      this.confirmService.close();
    }
  }

  close() {
    this.confirmService.close();
  }
}
