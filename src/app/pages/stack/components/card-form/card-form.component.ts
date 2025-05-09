import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import { Card } from '../../../../../models/card';
import { CardServiceService } from '../../../../services/card-service.service';
import { Subscription, throwError } from 'rxjs';

@Component({
  selector: 'app-card-form',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './card-form.component.html',
  styleUrl: './card-form.component.css'
})
export class CardFormComponent implements OnInit {
  editingCard: any = null;
  form!: FormGroup;
  rootStackId: number = 0;

  @Input() isCardFormVisible : boolean = false;
  @Output() closeCardForm = new EventEmitter<void>();

  private dataSubscription: Subscription | undefined;

  constructor (
    private cardService: CardServiceService, 
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      question: ['', Validators.required],
      answers: this.fb.array([
        this.fb.control(''), 
        this.fb.control(''), 
        this.fb.control(''), 
        this.fb.control('')], 
        Validators.required
      ),
      correctAnswer: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.dataSubscription = this.cardService.dataList$.subscribe(data => {
      this.rootStackId = data.stackId;
    });

    this.dataSubscription = this.cardService.editingCard$.subscribe(data => {
      this.editingCard = data;
    });
    this.initializeEditForm(this.editingCard);
  }

  initializeEditForm(card?: Card) {
    const answersArray = this.fb.array(
      (card ? card.answers : ['', '', '', '']).map(a => this.fb.control(a)),
      Validators.required
    );
  
    this.form.setControl('answers', answersArray);
  
    this.form.patchValue({
      question: card?.question || '', 
      correctAnswer: card?.correctAnswer || '' 
    });
  }

  get answers(): FormArray {
    return this.form.get('answers') as FormArray;
  }

  trackByIndex(index: number): number {
    return index;
  }

  onCloseCardForm() {
    this.closeCardForm.emit();
    if (this.editingCard)
    {
      this.cardService.setEditingCard(null);
    }
  }

  onSubmit() {
    const payload: Card = this.form.value;
    payload.stackId = this.rootStackId;

    if (this.form.invalid) {  
      alert('Please fill in all required fields.');
      return;
    }

    if (this.editingCard) {
      this.editCard(payload);
      this.cardService.setEditingCard(null);
    } else {
      this.addNewCard(payload);
    }
  }

  editCard(card: Card) {
    const editRequest = {
      question: card.question, 
      answers: card.answers, 
      correctAnswer: card.correctAnswer, 
      stackId: card.stackId,
      cardId: this.editingCard.cardId
    };

    this.cardService.updateCard(editRequest).subscribe({
      next: () => {
        this.closeCardForm.emit();
        this.refrechCardList();
      },
      error: (error) => this.handleError(error, 'Update failed.')
    });
  }

  addNewCard(card: Card) {
    const addRequest = {
      question: card.question, 
      answers: card.answers, 
      correctAnswer: card.correctAnswer, 
      stackId: card.stackId,
      cardId: 0
    };

    this.cardService.createCard(addRequest).subscribe({
      next: () => {
        this.closeCardForm.emit();
        this.refrechCardList();
      },
      error: (error) => this.handleError(error, 'Creation failed.')
    });
  }

  refrechCardList(): void {
    this.cardService.getCardsByStack(this.rootStackId).subscribe({
      next: (data) => {
        this.cardService.setData({
          stackId: this.rootStackId,
          cards: data
        });
      },
      error: (error) => this.handleError(error, 'Failed to fetch cards. Please try again later.')
    });
  }

  handleError(error: any, customMessage: string) {
    console.error(customMessage, error);
    alert(customMessage);
  }
}
