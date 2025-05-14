import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ScoreServiceService } from '../../services/score-service.service';

@Component({
  selector: 'app-input-mode-button',
  imports: [],
  templateUrl: './input-mode-button.component.html',
  styleUrl: './input-mode-button.component.css'
})
export class InputModeButtonComponent {

  constructor(
    private router: Router,
    private scoreService: ScoreServiceService
  ) {}

  onInputModeClick(): void{
    this.scoreService.setInputModeOn(true);
    this.router.navigate(['quiz']);
  }
}
