import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardDto } from '../../../models/cardDto';
import { CardServiceService } from '../../services/card-service.service';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';

@Component({
  selector: 'app-input-mode',
  imports: [
    BackButtonComponent, 
    FormsModule, 
    ReactiveFormsModule, 
    CommonModule
  ],
  templateUrl: './input-mode.component.html',
  styleUrl: './input-mode.component.css'
})
export class InputModeComponent implements OnInit {
  cards: any = [];
  currentIndex: number = 0;
  currentCard: CardDto = { 
    question: '', 
    answers: ['', '', '', ''],
    correctAnswer: ''
  };

  score: number = 0;
  showScore: boolean = false;

  form!: FormGroup;

  isCorrectAnswer: boolean | null = null;
  inputTouched: boolean = false;
  currenClass: string = '';

  constructor(
    private cardService: CardServiceService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      userAnswer: [{ value: '', disabled: true } , Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchCards();
    this.loadNextCard();
  }

  fetchCards(): void {
    this.cardService.getData().subscribe({
      next: (data) => {
        this.cards = data.cards;
      },
      error: (error) => this.handleError(error, 'Failed, try again later.')
    })
  }

  resetFormState(): void {
    this.form.reset();     
    this.isCorrectAnswer = null;
    this.inputTouched = false;
    this.form.get('userAnswer')?.enable();
  }
  
  checkAnswer() {
    const userAnswer = this.form.get('userAnswer')?.value?.trim().toLowerCase();
    const correctAnswer = this.currentCard?.correctAnswer?.trim().toLowerCase();

    this.form.get('userAnswer')?.disable();

    if (userAnswer == correctAnswer && userAnswer != '') {
      this.score++;
      this.isCorrectAnswer = true;
    } else {
      this.isCorrectAnswer = false;
    }
  }
  
  displayScore(): void {
    this.showScore = true;
  }
  
  onCloseScore(): void {
    this.showScore = false;
  }

  loadNextCard() {
    if (this.currentIndex == this.cards.length) {
      this.displayScore();
      return;
    }

    this.resetFormState();

    const currentCardDb = this.cards[this.currentIndex];
    this.currentIndex++;
    this.currentCard = {
      question: currentCardDb.question,
      answers: currentCardDb.answers,
      correctAnswer: currentCardDb.correctAnswer
    }
  }

  onInputFocus() {
    this.inputTouched = true;
  }

  handleError(error: any, customMessage: string) {
    console.error(customMessage, error);
    alert(customMessage);
  }
}
