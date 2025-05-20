import { Component, OnInit, OnDestroy  } from '@angular/core';
import { RouterLink, RouterOutlet, Router} from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DialogServiceService } from '../../services/dialog-service.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink, 
    RouterOutlet,
    CommonModule,
    ConfirmDialogModule,
    ButtonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers: [ConfirmationService]
})
export class HeaderComponent  implements OnInit, OnDestroy{

  isAuthenticated: boolean = false;
  username: string | null = null;
  userSubscription: Subscription | undefined;
  isAuthenticatedSubscription: Subscription | undefined;
  isAnswering: boolean = false;
  position = 'center' as const;


  constructor(
    public authService: AuthServiceService, 
    private router: Router,
    private dialogService: DialogServiceService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.dialogService.isAnswering$.subscribe(data => 
      this.isAnswering = data
    );
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

  onHome() {
    if (!this.isAnswering) {
      this.goHome();
    } else {
      this.dialogService.show({
      title: 'Are you sure?',
      message: 'You haven\'t completed the quiz yet. Do you really want to go back?',
      accept: () => {
        this.dialogService.setIsAnswering(false);
        this.goHome();
      },
      reject: () => {

      }
    });
    }
  }  

  goHome() {
    if (this.authService.isAuthenticated()) {
        this.router.navigate(['user']);
    } else {
      this.router.navigate(['']);
    }
  }
}
