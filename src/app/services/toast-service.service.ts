import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastServiceService {

  private toastSubject = new Subject<{ message: string, duration: number }>();
  toastState$ = this.toastSubject.asObservable();

  constructor() { }

  showToast(message: string, duration: number = 3000) {
    this.toastSubject.next({ message, duration });
  }
}
