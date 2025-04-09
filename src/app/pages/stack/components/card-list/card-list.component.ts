import { Component, OnInit } from '@angular/core';
import { CardServiceService } from '../../../../services/card-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import { Subscriber } from 'rxjs';
import { Card } from '../../../../../models/card';

@Component({
  selector: 'app-card-list',
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule
  ],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css'
})
export class CardListComponent implements OnInit {
  cards: any[] = [];
  rootStackId: number = 0;

  showForm: boolean = false;
  editingCard: any = null;
  form!: FormGroup;

  constructor(
    private cardService: CardServiceService, 
    private fb: FormBuilder
  ){
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
    this.loadStacks();
  }

  loadStacks(): void {
    this.cardService.getData().subscribe({
      next: (data) => {
        this.cards = data.cards;
        this.rootStackId = data.stackId;
      },
      error: (error) => this.handleError(error, 'Failed to get Stack, please try again later.')
    })
  }

  initializeEditForm(card?: Card) {
    const answers = card ? card.answers : ['', '', '', ''];
    this.form.setValue({
      question: card ? card.question : '',
      answers: answers,
      correctAnswer: card? card.correctAnswer : ''
    })
  }

  get answers(): FormArray {
    return this.form.get('answers') as FormArray;
  }
  
  trackByIndex(index: number): number {
    return index;
  }

  closeForm() {
    this.showForm = false;
    this.editingCard = null;
    this.resetForm();
  }
  
  resetForm() {
    this.form.reset({
      question: '',
      answers: ['', '', '', ''],
      correctAnswer: ''
    });
  }

  onEditCardInit(cardToEdit: Card) {
    this.showForm = true;
    this.editingCard = cardToEdit;
    this.initializeEditForm(cardToEdit);
  }

  onClickDeleteCard(cardId: number) {
    this.cardService.deleteCard(cardId).subscribe({
      next: () => {
        this.refreshCardList();
      },
      error: (error) => this.handleError(error, 'Failed to delete, please try again later.')
    })
  }

  onSubmit() {
    const payload: Card = this.form.value;
    payload.stackId = this.rootStackId;

    if (this.form.invalid) {  
      alert('Please fill in all required fields.');
      return;
    }

    if (this.editingCard) {
      payload.cardId = this.editingCard.cardId ?? 0,
      this.cardService.updateCard(payload).subscribe({
        next: () => {
          this.closeForm();
          this.refreshCardList();
        },
        error: (error) => this.handleError(error, 'Update failed.')
      });
    } else {
      this.cardService.createCard(payload).subscribe({
        next: () => {
          this.closeForm();
          this.refreshCardList();
        },
        error: (error) => this.handleError(error, 'Creation failed.')
      });
    }
  }
  
  refreshCardList(): void {
    this.cardService.getCardsByStack(this.rootStackId).subscribe({
      next: (data) => {
        this.cards = data;
      },
      error: (error) => this.handleError(error, 'Failed to get Cards, please try again later.')
    });
  }

  handleError(error: any, customMessage: string) {
    console.error(customMessage, error);
    alert(customMessage);
  }
}
