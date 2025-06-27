import { Component, OnInit, OnDestroy, ElementRef, HostListener, ViewChild  } from '@angular/core';
import { RouterLink, RouterOutlet, Router} from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DialogServiceService } from '../../services/dialog-service.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ScoreServiceService } from '../../services/score-service.service';
import { FavoriteStackServiceService } from '../../services/favorite-stack-service.service';
import { UserInfo } from '../../../models/userInfo';
import { CardServiceService } from '../../services/card-service.service';

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
  userInfo: UserInfo | null = null;
  username: string | null = null;
  userSubscription: Subscription | undefined;
  isAuthenticatedSubscription: Subscription | undefined;
  isAnswering: boolean = false;
  position = 'center' as const;

  menuVisible = false;
  sidebarVisible = false;
  isMenuOpen = false;
  favoriteStacks: any[] = [];
  stackIds: number[] = [];
  menuTop = 0;
  menuLeft = 0;

  @ViewChild('menuRef') menuRef!: ElementRef;

  constructor(
    public authService: AuthServiceService, 
    private router: Router,
    private dialogService: DialogServiceService,
    private confirmationService: ConfirmationService,
    private scoreService: ScoreServiceService,
    private favoriteStackService: FavoriteStackServiceService,
    private cardService: CardServiceService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.dialogService.isAnswering$.subscribe(data => 
      this.isAnswering = data
    );
    this.userSubscription = this.authService.user$.subscribe(
      (userInfo) => {
        this.userInfo = userInfo,
        this.username = userInfo?.userName ?? null;
      });
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
        this.scoreService.setInputModeOn(false);
        this.scoreService.setChoiceModeOn(false);
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

  toggleMenu(event: MouseEvent, trigger: HTMLElement) {
    event.stopPropagation();  
    this.loadFavorites();

    if (this.menuVisible = !this.menuVisible) {
      this.setMenuPosition(trigger);
    }
  }

  private setMenuPosition(trigger: HTMLElement): void {
    const rect = trigger.getBoundingClientRect();
    this.menuTop = rect.bottom + window.scrollY;
    this.menuLeft = rect.left + window.scrollX;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.menuRef?.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.menuVisible = false;
    }
  }

  openSidebar() {
    this.menuVisible = false;
    this.sidebarVisible = true;
    console.log('now favoriteStacks equel:');
    console.log(this.favoriteStacks);
  }

  closeSidebar() {
    this.sidebarVisible = false;
  }

  loadFavorites() {
    this.favoriteStackService.getFavoriteStackList().subscribe({
      next: (data) => {
        this.favoriteStacks = data;
        this.stackIds = this.favoriteStacks.map(stack => stack.stackId);
      },
      error: (error) => this.handleError(error, 'Failed to load Stack data. Please try again later.')
    })
  }

  onFavoriteChange(event: Event, stackId: number): void {
    const isChecked = this.isCheckboxChecked(event);

    if (isChecked) {
      this.addToFavorites(stackId);
    } else {
       this.removeFromFavorites(stackId);
    }
  }

  private isCheckboxChecked(event: Event): boolean {
    return (event.target as HTMLInputElement).checked;
  }

  private addToFavorites(stackId: number): void {
    const request = this.buildFavoriteRequest(stackId);
    this.favoriteStackService.addFavoriteStack(request).subscribe({
      next: (data) => this.updateFavoriteStacks(data),
      error: (error) => this.handleError(error, 'Failed to add favorite. Please try again later.')
    });
  }

  private removeFromFavorites(stackId: number): void {
    const request = this.buildFavoriteRequest(stackId);
    this.favoriteStackService.removeFavoriteStack(request).subscribe({
      next: (data) => this.updateFavoriteStacks(data),
      error: (error) => this.handleError(error, 'Failed to remove favorite. Please try again later.')
    });
  }

  private buildFavoriteRequest(stackId: number): { stackId: number, userId: number } {
    const userId = Number(this.userInfo?.userId);
    return { stackId, userId };
  }

  private updateFavoriteStacks(data: any): void {
    this.favoriteStacks = data;
    console.log('Updated favorite stacks:', data);
  }

  onDetailsViewer(stackId: number): void {
    this.cardService.getCardsByStack(stackId).subscribe({
      next: (cards) => this.handleCardData(stackId, cards),
      error: (error) => this.handleError(error, 'Creation failed.')
    });
  }
 
  private handleCardData(stackId: number, cards: any[]): void {
    const payload = this.buildCardPayload(stackId, cards);
    this.cardService.setData(payload);
    this.router.navigate(['/card-view']);
  }

  private buildCardPayload(stackId: number, cards: any[]): { stackId: number, cards: any[] } {
    return { stackId, cards };
  }
  handleError(error: any, customMessage: string) {
    console.error(customMessage, error);
    alert(customMessage);
  }
}
