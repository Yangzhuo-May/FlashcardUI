import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  imports: [
    CommonModule
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  @Input() isVisible = false;
  @Input() title?: string;
  @Input() message?: string;
  @Input() acceptCallback?: () => void;
  @Input() rejectCallback?: () => void;

  @Output() confirmed = new EventEmitter<boolean>();

  onConfirm(): void {
    this.isVisible = false;
     if (this.acceptCallback) {
      this.acceptCallback();
    }
  }

  onCancel(): void {
    this.isVisible = false;
    if (this.rejectCallback) {
      this.rejectCallback();
    }
  }
}
