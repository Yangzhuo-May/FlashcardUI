import { Component, OnInit } from '@angular/core';
import { StackServiceService } from '../../../../services/stack-service.service';
import { CardServiceService } from '../../../../services/card-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stack-list',
  imports: [
    CommonModule, 
    FormsModule
  ],
  templateUrl: './stack-list.component.html',
  styleUrl: './stack-list.component.css'
})
export class StackListComponent implements OnInit {
  stacks: any[] = [];
  cards: any[] = [];

  isAddFormVisible: boolean = false;
  isEditFormVisible: boolean = false;
  newStackName: string = '';
  editedStackName: string = '';
  editingStackId: number | null = 0;

  constructor(
    private stackService: StackServiceService, 
    private cardService: CardServiceService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.loadStacks();
  }

  loadStacks(): void {
    this.stackService.getStacks().subscribe({
      next: (data) => {
        this.stacks = data;
      },
      error: (error) => this.handleError(error, 'Failed to load Stack data. Please try again later.')
    })
  }

  goToCardList(stackId: number): void {
    if (stackId !== null) {
      this.cardService.getCardsByStack(stackId).subscribe({
        next: (data) => {
          this.cardService.setData({
            stackId: stackId,
            cards: data
          });
          this.router.navigate(['/cards', stackId]);
        },
        error: (error) => this.handleError(error, 'Failed to fetch cards. Please try again later.')
      });
    }
  } 

  onNewStackClick(): void {
    if (this.newStackName) {
      this.stackService.createStack(this.newStackName).subscribe({
        next: (data) => {
          this.stacks = data.stack;
        },
        error: (error) => this.handleError(error, 'Failed to create Stack. Please try again later.')
      });         
    } else {
      alert('Please enter the Stack name.');
    }
  }

  onEditStackInit(stackId: number): void {
    this.isAddFormVisible = false;
    this.isEditFormVisible = true;
    this.editingStackId = stackId;
  }

  onEditStackClick(stackName: string, stackId: number | null) {
    if (stackId == null) {
      alert('Invalid Stack name or ID.');
      return;
    } 

    this.stackService.updateStack(stackName, stackId).subscribe({
      next: (data) => {
        this.stacks = data.stack;
        this.isEditFormVisible = false;
        this.editedStackName = '';
      },
      error: (error) => this.handleError(error, 'Failed to update Stack. Please try again later.')
    })
  }

  onDeleteStackClick(stack: any): void {
    this.stackService.deleteStack(stack).subscribe({
      next: (data) => {
        this.stacks = data.stack;
      },
      error: (error) => this.handleError(error, 'Failed to delete Stack. Please try again later.')
    });
  }

  handleError(error: any, customMessage: string) {
    console.error(customMessage, error);
    alert(customMessage);
  }
}
