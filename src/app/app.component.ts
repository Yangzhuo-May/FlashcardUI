import { Component, AfterViewInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { HomeComponent } from './pages/home/home/home.component';
import { HeaderComponent } from './shared/header/header.component';
import { ToastComponent } from './shared/toast/toast.component';
import { ToastServiceService } from './services/toast-service.service';
import TypeIt from 'typeit';

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
export class AppComponent implements AfterViewInit {
  title = 'flashcardUI';

  constructor(private toastService: ToastServiceService) { }
  
  ngAfterViewInit() {
    new TypeIt("#type-target", {
      strings: ["Hello, Angular!", "This is TypeIt.js 🎉"],
      speed: 100,
      breakLines: false,
      loop: true
    }).go();
  }
}
