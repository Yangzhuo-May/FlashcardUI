import { Component } from '@angular/core';
import { CardListComponent } from '../components/card-list/card-list.component';
import { BackButtonComponent } from '../../../shared/back-button/back-button.component';
import { InputModeButtonComponent } from '../../../shared/input-mode-button/input-mode-button.component';
import { ChoiceModeButtonComponent } from '../../../shared/choice-mode-button/choice-mode-button.component';

@Component({
  selector: 'app-stack',
  imports: [
    CardListComponent, 
    BackButtonComponent,
    InputModeButtonComponent,
    ChoiceModeButtonComponent
  ],
  templateUrl: './stack.component.html',
  styleUrl: './stack.component.css'
})
export class StackComponent {

}
