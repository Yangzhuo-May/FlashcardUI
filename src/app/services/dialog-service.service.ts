import { Injectable, ComponentRef, ApplicationRef, EnvironmentInjector , createComponent } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfirmDialogComponent } from '../shared/notifications/confirm-dialog/confirm-dialog.component';

interface ConfirmDialogConfig {
  title?: string;
  message?: string;
  accept?: () => void;
  reject?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class DialogServiceService {
  private isAnswering = new BehaviorSubject<boolean>(false);
  isAnswering$ = this.isAnswering.asObservable();

  setIsAnswering(data: boolean): void {
    this.isAnswering.next(data);
  }

  private dialogComponentRef: ComponentRef<ConfirmDialogComponent> | null = null;

  constructor(
    private appRef: ApplicationRef,
    private environmentInjector: EnvironmentInjector
  ) {}

  show(config: ConfirmDialogConfig): void {  
    if (!this.dialogComponentRef) {
      this.dialogComponentRef = createComponent(ConfirmDialogComponent,  { environmentInjector: this.environmentInjector });
      this.appRef.attachView(this.dialogComponentRef.hostView);
      document.body.appendChild(this.dialogComponentRef.location.nativeElement);
    }

    if (this.dialogComponentRef) {
      this.dialogComponentRef.instance.title = config.title;
      this.dialogComponentRef.instance.message = config.message;
      this.dialogComponentRef.instance.acceptCallback = config.accept;
      this.dialogComponentRef.instance.rejectCallback = config.reject;
      this.dialogComponentRef.instance.isVisible = true;
    } 
  }

  private destroyDialog(): void {
    if (this.dialogComponentRef) {
      this.appRef.detachView(this.dialogComponentRef.hostView);
      this.dialogComponentRef.destroy();
      this.dialogComponentRef = null;
    }
  }
}
