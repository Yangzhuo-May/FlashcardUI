import { Component, Output, Input, OnInit, EventEmitter } from '@angular/core';
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
  
  @Input()  answers: string[] = ['', '', '', ''];
  @Output() triggerCheck = new EventEmitter<string>();

  ngOnInit(): void {
    
  }

  selectAnswer(answer: string) {
    this.triggerCheck.emit(answer);
  }

  handleError(error: any, customMessage: string) {
    console.error(customMessage, error);
    alert(customMessage);
  }
}
