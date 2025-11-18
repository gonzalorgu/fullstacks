import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast/toast';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss'
})
export class Toast {
   toastService = inject(ToastService);

  close(id: string) {
    this.toastService.remove(id);
  }
}
