import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CardServiceService } from '../../../../services/card-service.service';
import { CommonModule } from '@angular/common';
import { Card } from '../../../../../models/card';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-list',
  imports: [
    CommonModule, 
  ],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css'
})
export class CardListComponent implements OnInit {
  cards: any[] = [];
  rootStackId: number = 0;

  editingCard: any = null;

  @Output() openCardForm = new  EventEmitter<void>();
  @Output() openMultiCardForm = new  EventEmitter<void>();

  private dataSubscription: Subscription | undefined;

  constructor(
    private cardService: CardServiceService, 
    private router: Router
  ){}

  ngOnInit(): void {
    this.dataSubscription = this.cardService.dataList$.subscribe(data => {
      this.cards = data.cards;
      this.rootStackId = data.stackId;
    });
  }

  goToCardViewer(): void {
    this.router.navigate(['/card-view']);
  }

  onNewCardClick() {
    this.openCardForm.emit();
  }

  onMultiNewCardClick() {
    this.openMultiCardForm.emit();
  }

  onEditCardInit(cardToEdit: Card) {
    this.cardService.setEditingCard(cardToEdit);
    this.openCardForm.emit();
  }

  onClickDeleteCard(cardId: number) {
    this.cardService.deleteCard(cardId).subscribe({
      next: () => {
        this.cardService.getCardsByStack(this.rootStackId).subscribe({
          next: (data) => {
            this.cardService.setData({
              stackId: this.rootStackId,
              cards: data
            });
          },
          error: (error) => this.handleError(error, 'Creation failed.')
        });
      },
      error: (error) => this.handleError(error, 'Failed to delete, please try again later.')
    })
  }

  handleError(error: any, customMessage: string) {
    console.error(customMessage, error);
    alert(customMessage);
  }
}
