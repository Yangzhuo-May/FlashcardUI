import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScoreServiceService {

  constructor() { }

  private isCorrectAnswer = new BehaviorSubject<boolean>(false);
  isCorrectAnswer$ = this.isCorrectAnswer.asObservable();

  private answerChecked = new BehaviorSubject<boolean>(false);
  answerChecked$ = this.answerChecked.asObservable();

  private showScore = new BehaviorSubject<boolean>(false);
  showScore$ = this.showScore.asObservable();

  private score = new BehaviorSubject<number>(0);
  score$ = this.score.asObservable();

  setScore(score: number): void {
    console.log('setScore to', score);
    this.score.next(score);
  }

  setAnswerCorrect(isCorrect: boolean): void {
    console.log('setAnswerCorrect to', isCorrect);

    this.isCorrectAnswer.next(isCorrect);
  }

  setAnswerChecked(isChecked: boolean) {
    console.log('setAnswerChecked to', isChecked);

  this.answerChecked.next(isChecked);
  }

  setShowScore(show: boolean) {
    console.log('setShowScore to', show);

    this.showScore.next(show);
  }
}
