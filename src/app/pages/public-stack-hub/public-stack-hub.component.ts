import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StackServiceService } from '../../services/stack-service.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { FavoriteStackServiceService } from '../../services/favorite-stack-service.service';
import { Subscription } from 'rxjs';
import { UserInfo } from '../../../models/userInfo';
import { CardServiceService } from '../../services/card-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-public-stack-hub',
  imports: [
    CommonModule
  ],
  templateUrl: './public-stack-hub.component.html',
  styleUrl: './public-stack-hub.component.css'
})
export class PublicStackHubComponent implements OnInit {
  stacks: any[] = [];
  favoriteStacks: any[] = [];
  stackIds: number[] = [];
  userInfo: UserInfo | null = null;
  userId: number = 0;

  private dataSubscription: Subscription | undefined;

  constructor(
    private stackService : StackServiceService,
    private favoriteStackService: FavoriteStackServiceService,
    private authService: AuthServiceService,
    private cardService: CardServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStacks();
    this.dataSubscription = this.authService.user$.subscribe(data => {
      this.userInfo = data;
    });
  }

  loadStacks(): void {
    this.stackService.getPublicStacks().subscribe({
      next: (data) => {
        this.stacks = data;
      },
      error: (error) => this.handleError(error, 'Failed to load Stack data. Please try again later.')
    })
    this.favoriteStackService.getFavoriteStackList().subscribe({
      next: (data) => {
        this.favoriteStacks = data;
        this.stackIds = this.favoriteStacks.map(stack => stack.stackId);
        console.log(data);
      },
      error: (error) => this.handleError(error, 'Failed to load Stack data. Please try again later.')
    })
  }

  onFavoriteChange(event: Event, stackId: number): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      const userId = Number(this.userInfo?.userId);
      const request = {
        stackId: stackId,
        userId: userId
      }
      this.favoriteStackService.addFavoriteStack(request).subscribe({
        next: (data) => {
          this.favoriteStacks = data;
          console.log(data);
        },
        error: (error) => this.handleError(error, 'Failed to load Stack data. Please try again later.')
      })
    } else {
      const userId = Number(this.userInfo?.userId);
      const request = {
        stackId: stackId,
        userId: userId
      }
      this.favoriteStackService.removeFavoriteStack(request).subscribe({
        next: (data) => {
          this.favoriteStacks = data;
          console.log(data);
        },
        error: (error) => this.handleError(error, 'Failed to load Stack data. Please try again later.')
      })
    }
  }

  onDtailsViewer(stackId: number) {
    this.cardService.getCardsByStack(stackId).subscribe({
      next: (data) => {
        this.cardService.setData({
          stackId: stackId,
          cards: data
        });
      },
      error: (error) => this.handleError(error, 'Creation failed.')
    });
    this.router.navigate(['/card-view']);
  }
  
  handleError(error: any, customMessage: string) {
    console.error(customMessage, error);
    alert(customMessage);
  }
}
