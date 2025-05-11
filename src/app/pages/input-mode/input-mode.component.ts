import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardDto } from '../../../models/cardDto';
import { CardServiceService } from '../../services/card-service.service';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';
import { ScoreServiceService } from '../../services/score-service.service';
import { ScoreDisplayComponent } from '../../shared/score-display/score-display.component';

@Component({
  selector: 'app-input-mode',
  imports: [
    BackButtonComponent,
    ScoreDisplayComponent, 
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
  rootStackId: number = 0;
  form!: FormGroup;
  
  isFlipped = false;
  isCorrectAnswer: boolean | null = null;

  inputTouched: boolean = false;

  constructor(
    private cardService: CardServiceService,
    private scoreService: ScoreServiceService,
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
    this.cardService.dataList$.subscribe(data => {
      this.cards = data.cards;
      this.rootStackId = data.stackId;
      console.log('cardList from service:', data);
    });
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
  
  flipCard() {
    this.isFlipped = !this.isFlipped;
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
