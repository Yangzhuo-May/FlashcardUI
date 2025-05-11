import { Component, OnInit } from '@angular/core';
import { CardServiceService } from '../../services/card-service.service';
import { CardDto } from '../../../models/cardDto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';
import { ScoreDisplayComponent } from '../../shared/score-display/score-display.component';
import { ScoreServiceService } from '../../services/score-service.service';

@Component({
  selector: 'app-choice-mode',
  imports: [
    FormsModule, 
    CommonModule, 
    BackButtonComponent,
    ScoreDisplayComponent
  ],
  templateUrl: './choice-mode.component.html',
  styleUrl: './choice-mode.component.css'
})
export class ChoiceModeComponent implements OnInit {
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
  
  answerChecked: boolean = false;
  selectedAnswer: string = '';

  constructor(
    private cardService: CardServiceService,
    private scoreService: ScoreServiceService
  ) {}

  ngOnInit(): void {
    this.fetchCards();
    this.loadNextCard();
    this.scoreService.setShowScore(this.showScore);
  }

  fetchCards(): void {
    this.cardService.dataList$.subscribe(data => {
      this.cards = data.cards;
      this.rootStackId = data.stackId;
      console.log('cardList from service:', data);
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

  checkAnswer(answer: string) {
    this.selectedAnswer = answer;
    this.answerChecked = true;
    this.scoreService.setAnswerChecked(this.answerChecked);

    if (this.answerChecked && this.selectedAnswer == this.currentCard.correctAnswer) {
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
  }

  flipCard() {
    this.isFlipped = true;
    setTimeout(() => {
      this.isFlipped = false;
      this.loadNextCard();
    }, 3000);
  }

  handleError(error: any, customMessage: string) {
    console.error(customMessage, error);
    alert(customMessage);
  }
}
