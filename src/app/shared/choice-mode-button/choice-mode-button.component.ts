import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ScoreServiceService } from '../../services/score-service.service';

@Component({
  selector: 'app-choice-mode-button',
  imports: [],
  templateUrl: './choice-mode-button.component.html',
  styleUrl: './choice-mode-button.component.css'
})
export class ChoiceModeButtonComponent {

  constructor(
    private router: Router,
    private scoreService: ScoreServiceService
  ) {}

  onChoiceModeClick(): void{
    this.scoreService.setChoiceModeOn(true);
    this.router.navigate(['quiz']);
  }
}
