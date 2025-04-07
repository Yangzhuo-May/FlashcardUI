import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardServiceService } from '../../services/card-service.service';
import { Card } from '../../../models/card';
import { CardDto } from '../../../models/cardDto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Location } from '@angular/common';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';

@Component({
  selector: 'app-choice-mode',
  imports: [FormsModule, CommonModule, BackButtonComponent],
  templateUrl: './choice-mode.component.html',
  styleUrl: './choice-mode.component.css'
})
export class ChoiceModeComponent {
  cards: any = [];
  currentIndex: number = 0;
  currentCard: CardDto = { 
    question: '', 
    answers: ['', '', '', ''],
    correctAnswer: ''
  };

  score: number = 0;
  showScore: boolean = false;
  selectedAnswer: string = '';
  isCorrectAnswer: boolean = false;

  constructor(
    private location: Location,
    private cardService: CardServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchCards();
    this.updatePage();
  }

  fetchCards(): void {
    this.cardService.getData().subscribe({
      next: (res) => {
        this.cards = res.cards;
        console.log('cards:', this.cards);
      },
      error: (err) => this.handleError(err, 'Failed, try again later.')
    })
  }


  updatePage() {
    if (this.currentIndex == this.cards.length) {
      this.displayScore();
      return;
    }

    this.answerChecked = false;

    const currentCardDb = this.cards[this.currentIndex];
    console.log('cards is ', currentCardDb);
    this.currentIndex++;
    this.currentCard = {
      question: currentCardDb.question,
      answers: currentCardDb.answers,
      correctAnswer: currentCardDb.correctAnswer
    }
  }

  displayScore(): void {
    this.showScore = true;
  }

  answerChecked = false;
  currenClass: string = '';

  checkAnswer(answer: string) {
    this.selectedAnswer = answer;
    this.answerChecked = true;

    if (this.selectedAnswer == this.currentCard.correctAnswer) {
      this.score++;
    }
  }

  handleError(error: any, customMessage: string) {
    console.error(customMessage, error);
    alert(customMessage);
  }

  goBack(): void {
    this.showScore = false;
  }
}
