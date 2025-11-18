import { Injectable, signal } from '@angular/core';

export interface ConfirmDialog {
  id: string;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  type: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  dialog = signal<ConfirmDialog | null>(null);

  show(
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel: () => void = () => {},
    type: 'danger' | 'warning' | 'info' = 'warning',
    confirmText: string = 'Confirmar',
    cancelText: string = 'Cancelar'
  ) {
    this.dialog.set({
      id: Date.now().toString(),
      title,
      message,
      confirmText,
      cancelText,
      type,
      onConfirm,
      onCancel
    });
  }

  confirm(
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText: string = 'Eliminar'
  ) {
    this.show(title, message, onConfirm, () => {}, 'danger', confirmText, 'Cancelar');
  }

  showMessage(
    message: string,
    type: 'danger' | 'warning' | 'info' = 'info',
    title: string = ''
  ) {
    this.dialog.set({
      id: Date.now().toString(),
      title,
      message,
      confirmText: '',  // Oculta botón
      cancelText: '',   // Oculta botón
      type,
      onConfirm: () => {},
      onCancel: () => {}
    });
    setTimeout(() => this.close(), 2200); // Auto-cierra en 2.2s
  }

  close() {
    this.dialog.set(null);
  }
}
