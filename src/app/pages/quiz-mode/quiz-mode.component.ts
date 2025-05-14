import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardDto } from '../../../models/cardDto';
import { CardServiceService } from '../../services/card-service.service';
import { ScoreServiceService } from '../../services/score-service.service';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';
import { ScoreDisplayComponent } from '../../shared/score-display/score-display.component';
import { ChoiceModeComponent } from '../choice-mode/choice-mode.component';
import { InputModeComponent } from '../input-mode/input-mode.component';

@Component({
  selector: 'app-quiz-mode',
   imports: [
    FormsModule, 
    CommonModule, 
    BackButtonComponent,
    ScoreDisplayComponent,
    ChoiceModeComponent,
    InputModeComponent
  ],
  templateUrl: './quiz-mode.component.html',
  styleUrl: './quiz-mode.component.css'
})
export class QuizModeComponent implements OnInit {
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

  isFlipped = false;
  isCorrectAnswer: boolean = false;
  isEnd: boolean = false;
  isChoiceModeOn: boolean = false;
  isInputModeOn: boolean = false;

  answerChecked: boolean = false;

  constructor(
    private cardService: CardServiceService,
    private scoreService: ScoreServiceService
  ) {}

  ngOnInit(): void {
    this.fetchCards();
    this.loadNextCard();
    this.scoreService.setShowScore(this.showScore);
    this.scoreService.isInputModeOn$.subscribe(data => {
      this.isInputModeOn = data;
    });
     this.scoreService.isChoiceModeOn$.subscribe(data => {
      this.isChoiceModeOn = data;
    });
  }

  fetchCards(): void {
    this.cardService.dataList$.subscribe(data => {
      this.cards = data.cards;
      this.rootStackId = data.stackId;
    });
  }

  loadNextCard() {
    if (this.currentIndex == this.cards.length) {
      this.endMode();
      return;
    }
    
    this.scoreService.setAnswerCorrect(false); 
    this.scoreService.setAnswerChecked(false);

    const currentCardDb = this.cards[this.currentIndex];
    this.currentIndex++;
    this.currentCard = {
      question: currentCardDb.question,
      answers: currentCardDb.answers,
      correctAnswer: currentCardDb.correctAnswer
    }
  }

  checkAnswer(userAnswer: string) {
    this.answerChecked = true;
    this.scoreService.setAnswerChecked(this.answerChecked);

    if (this.answerChecked && userAnswer == this.currentCard.correctAnswer) {
      this.score++;
      this.scoreService.setScore(this.score);
      this.scoreService.setAnswerCorrect(true);
    } 
    this.flipCard();
  }

  endMode() {
    this.showScore = true;
    this.isEnd = true;
    this.scoreService.setShowScore(this.showScore);
    this.scoreService.setChoiceModeOn(false);
    this.scoreService.setInputModeOn(false);
  }

  flipCard() {
    this.isFlipped = true;
    setTimeout(() => {
      this.isFlipped = false;
      setTimeout(() => { 
        this.loadNextCard();
      },200); 
    }, 3000);
  }

  handleError(error: any, customMessage: string) {
    console.error(customMessage, error);
    alert(customMessage);
  }
}
