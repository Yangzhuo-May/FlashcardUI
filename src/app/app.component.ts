import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { HomeComponent } from './pages/home/home/home.component';
import { HeaderComponent } from './shared/header/header.component';
import { ToastComponent } from './shared/toast/toast.component';
import { ToastServiceService } from './services/toast-service.service';

@Component({
  selector: 'app-root',
  imports: [
    HomeComponent, 
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive,
    HeaderComponent,
    ToastComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'flashcardUI';

  constructor(private toastService: ToastServiceService) { }
    
    showToast() {
      this.toastService.showToast('This is a toast message!');
    }
}
