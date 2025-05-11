import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { ScoreServiceService } from '../../services/score-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-score-display',
  imports: [
    CommonModule
  ],
  templateUrl: './score-display.component.html',
  styleUrl: './score-display.component.css'
})
export class ScoreDisplayComponent implements OnInit {
  isCorrectAnswer: boolean = false;
  answerChecked: boolean = false;
  showScore: boolean = false;
  score: number = 0;
  private dataSubscription: Subscription | undefined;
  
  constructor(
    private scoreService: ScoreServiceService
  ) {}

  ngOnInit(): void {
    this.dataSubscription = this.scoreService.score$.subscribe(data => {
      this.score = data;
    });
    this.dataSubscription = this.scoreService.isCorrectAnswer$.subscribe(data => {
      this.isCorrectAnswer = data;
    });
    this.dataSubscription = this.scoreService.answerChecked$.subscribe(data => {
      this.answerChecked = data;
    });
    this.dataSubscription = this.scoreService.showScore$.subscribe(data => {
      this.showScore = data;
    });
  }
}
