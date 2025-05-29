import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

@Injectable({
  providedIn: 'root'
})
export class ToastServiceService {

  private toastSubject = new Subject<{ message: string, type: ToastType, duration: number }>();
  toastState$ = this.toastSubject.asObservable();

  constructor() { }

  showToast(message: string,  type: ToastType = 'success', duration: number = 3000) {
    this.toastSubject.next({ message, type, duration });
  }
}
