import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choice-mode-button',
  imports: [],
  templateUrl: './choice-mode-button.component.html',
  styleUrl: './choice-mode-button.component.css'
})
export class ChoiceModeButtonComponent {

  constructor(private router: Router) {}

  onChoiceModeClick(): void{
    this.router.navigate(['learn/choice']);
  }
}
