import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChoiceModeButtonComponent } from '../../../shared/choice-mode-button/choice-mode-button.component';
import { InputModeButtonComponent } from '../../../shared/input-mode-button/input-mode-button.component';
import { StackListComponent } from '../components/stack-list/stack-list.component';
import { CardServiceService } from '../../../services/card-service.service';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule, 
    FormsModule, 
    ChoiceModeButtonComponent, 
    InputModeButtonComponent,
    StackListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor( private cardService: CardServiceService) {}

  ngOnInit(): void {
    this.loadAllCards();
  }
  
  loadAllCards(): void {
    this.cardService.getAllCards().subscribe({
      next: (data) => {
        this.cardService.setData({
          stackId: 0,
          cards: data
        });
      },
      error: (error) => this.handleError(error, 'Failed to fetch cards. Please try again later.')
    });
  }

  handleError(error: any, customMessage: string) {
    console.error(customMessage, error);
    alert(customMessage);
  }
}
