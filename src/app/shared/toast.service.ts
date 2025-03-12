import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  activeToast = signal<Toast | null>(null);

  showToast(
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    duration: number = 3000
  ) {
    this.activeToast.set({ message, type });

    setTimeout(() => {
      this.hideToast();
    }, duration);
  }

  hideToast() {
    this.activeToast.set(null);
  }
}
