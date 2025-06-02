import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import { Card } from '../../../../../models/card';
import { CardServiceService } from '../../../../services/card-service.service';
import { Subscription, throwError } from 'rxjs';
import { ToastServiceService } from '../../../../services/toast-service.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-card-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './card-form.component.html',
  styleUrl: './card-form.component.css'
})
export class CardFormComponent implements OnInit {
  editingCard: any = null;
  form!: FormGroup;
  rootStackId: number = 0;
  bulkCard: string = '';

  @Input() isCardFormVisible : boolean = false;
  @Input() isMultiCardFormVisible : boolean = false;
  @Output() closeCardForm = new EventEmitter<void>();
  @Output() closeMultiCardForm = new EventEmitter<void>();

  private dataSubscription: Subscription | undefined;

  constructor (
    private cardService: CardServiceService, 
    private toastService: ToastServiceService,
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

  onCloseMultiCardForm() {
    this.closeMultiCardForm.emit();
  }

  onSubmit() {
    const payload: Card = this.form.value;
    payload.stackId = this.rootStackId;

    if (this.form.invalid) {  
      this.toastService.showToast('Please fill in all required fields.', 'warning');
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

  importBulkCards() {
    if (!this.bulkCard.trim()) {
      this.toastService.showToast('Please entre the cards that you want to add', 'warning');
      return;
    }

    const lines = this.bulkCard.trim().split('\n');
    const newCards = lines.map(line => {
      const [question, correctAnswer, options] = line.split('|').map(s => s.trim());
      return {
        question: question,
        correctAnswer: correctAnswer,
        answers: options ? options.split(',').map(o => o.trim()) : [],
        stackId: this.rootStackId,
        cardId: 0
      };
    });

    this.cardService.createMultiCard(newCards).subscribe({
      next: () => {
        this.closeMultiCardForm.emit();
        this.refrechCardList();
      },
      error: (error) => this.handleError(error, 'Creation failed.')
    });

    this.bulkCard = '';

    this.toastService.showToast('Import sucesses', 'success');
  }

  handleError(error: any, customMessage: string) {
    console.error(customMessage, error);
    alert(customMessage);
  }
}
