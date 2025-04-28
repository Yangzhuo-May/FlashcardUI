import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-input-mode-button',
  imports: [],
  templateUrl: './input-mode-button.component.html',
  styleUrl: './input-mode-button.component.css'
})
export class InputModeButtonComponent {

  constructor(private router: Router) {}

  onInputModeClick(): void{
    this.router.navigate(['learn/input']);
  }
}
