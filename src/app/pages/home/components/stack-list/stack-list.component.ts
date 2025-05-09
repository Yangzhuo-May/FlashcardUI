import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { StackServiceService } from '../../../../services/stack-service.service';
import { CardServiceService } from '../../../../services/card-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

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

  @Output() openAddDialog = new  EventEmitter<void>();
  @Output() openEditDialog = new EventEmitter<void>();

  private dataSubscription: Subscription | undefined;

  constructor(
    private stackService: StackServiceService, 
    private cardService: CardServiceService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.loadStacks();
    this.dataSubscription = this.stackService.stackList$.subscribe(data => {
      this.stacks = data;
    });
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
    this.openAddDialog.emit();
  }

  onEditStackClick(editingStack: any) {
    this.stackService.setEditingStack(editingStack);
    this.openEditDialog.emit();
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
