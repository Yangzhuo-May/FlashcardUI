import { Component, OnInit, OnDestroy  } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink, 
    RouterOutlet,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent  implements OnInit, OnDestroy{

  isAuthenticated: boolean = false;
  username: string | null = null;
  userSubscription: Subscription | undefined;
  isAuthenticatedSubscription: Subscription | undefined;

  constructor(public authService: AuthServiceService, private router: Router) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.userSubscription = this.authService.user$.subscribe(
      (username) => (this.username = username)
    );
    this.isAuthenticatedSubscription = this.authService.isAuthenticated$.subscribe(
      (isAuthenticated) => (this.isAuthenticated = isAuthenticated)
    );
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.isAuthenticatedSubscription) {
      this.isAuthenticatedSubscription.unsubscribe();
    }
  }

  logout() {
    this.authService.logout();
  }

  goHome() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['user']);
    } else {
      this.router.navigate(['']);
    }
  }  
}
