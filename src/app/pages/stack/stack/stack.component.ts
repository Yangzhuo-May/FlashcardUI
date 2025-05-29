import { Component, OnInit } from '@angular/core';
import { CardListComponent } from '../components/card-list/card-list.component';
import { BackButtonComponent } from '../../../shared/back-button/back-button.component';
import { InputModeButtonComponent } from '../../../shared/input-mode-button/input-mode-button.component';
import { ChoiceModeButtonComponent } from '../../../shared/choice-mode-button/choice-mode-button.component';
import { CardFormComponent } from '../components/card-form/card-form.component';
import { CommonModule } from '@angular/common';
import { DailySummaryComponent } from '../../../shared/daily-summary/daily-summary.component';

@Component({
  selector: 'app-stack',
  imports: [
    CommonModule,
    CardListComponent, 
    BackButtonComponent,
    InputModeButtonComponent,
    ChoiceModeButtonComponent,
    CardFormComponent,
    DailySummaryComponent
  ],
  templateUrl: './stack.component.html',
  styleUrl: './stack.component.css'
})
export class StackComponent implements OnInit {
  isCardFormVisible: boolean = false;
  isGlobalFormVisible = false;

  ngOnInit(): void {
    
  }

  onOpenCardForm() {
    this.isCardFormVisible = true;
    this.isGlobalFormVisible = true;
  }

  onCloseCardForm() {
    this.isCardFormVisible = false;
    this.isGlobalFormVisible = false;
  }
}
