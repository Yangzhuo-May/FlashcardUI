import { Component, OnInit  } from '@angular/core';
import { ToastServiceService } from '../../services/toast-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [
    CommonModule
  ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit {
  toasts: { message: string, show: boolean }[] = [];

  constructor(private toastService: ToastServiceService) { }
  
  ngOnInit(): void {
    this.toastService.toastState$.subscribe(({ message, duration }) => {
      const toast = { message, show: false };
      this.toasts.unshift(toast);
      setTimeout(() => toast.show = true, 10);

      setTimeout(() => {
        toast.show = false;
        setTimeout(() => {
          const index = this.toasts.indexOf(toast);
          if (index >= 0) this.toasts.splice(index, 1);
        }, 400);
      }, duration);
    });
  }
}
