import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChoiceModeButtonComponent } from '../../../shared/choice-mode-button/choice-mode-button.component';
import { InputModeButtonComponent } from '../../../shared/input-mode-button/input-mode-button.component';
import { StackListComponent } from '../components/stack-list/stack-list.component';
import { CardServiceService } from '../../../services/card-service.service';
import { StackFormComponent } from '../components/stack-form/stack-form.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule, 
    FormsModule, 
    ChoiceModeButtonComponent, 
    InputModeButtonComponent,
    StackListComponent,
    StackFormComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isAddFormVisible: boolean = false;
  isEditFormVisible: boolean = false;
  isGlobalFormVisible = false;
  
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

  openAddForm() {
    this.isAddFormVisible = true;
    this.isGlobalFormVisible = true;
  }


  openEditForm() {
    this.isEditFormVisible = true;
    this.isGlobalFormVisible = true;
  }

  onCloseAddForm() {
    this.isAddFormVisible = false;
    this.isGlobalFormVisible = false;
  }
  onCloseEditForm() {
    this.isEditFormVisible = false;
    this.isGlobalFormVisible = false;
  }

  handleError(error: any, customMessage: string) {
    console.error(customMessage, error);
    alert(customMessage);
  }
}
