import { Component, OnInit } from '@angular/core';
import { CardServiceService } from '../../services/card-service.service';
import { CardDto } from '../../../models/cardDto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';

@Component({
  selector: 'app-choice-mode',
  imports: [
    FormsModule, 
    CommonModule, 
    BackButtonComponent
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

  rootStackId: number = 0;
  score: number = 0;
  showScore: boolean = false;
  selectedAnswer: string = '';
  isCorrectAnswer: boolean = false;
  answerChecked: boolean = false;

  questionState: 'notAnswered' | 'answered' = 'notAnswered';

  constructor(
    private cardService: CardServiceService,
  ) {}

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

  loadNextCard() {
    if (this.currentIndex == this.cards.length) {
      this.displayScore();
      return;
    }
    
    this.answerChecked = false;

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

    if (this.answerChecked && this.selectedAnswer == this.currentCard.correctAnswer) {
      this.score++;
    } 
  }

  displayCorrectAnswer(option: string): string {
    if (!this.answerChecked) {
      return 'default';  
    }
    return option === this.currentCard.correctAnswer ? 'correct' : 'wrong';
  }

  onCloseScore(): void {
    this.showScore = false;
  }

  displayScore(): void {
    this.showScore = true;
  }

  handleError(error: any, customMessage: string) {
    console.error(customMessage, error);
    alert(customMessage);
  }
}
