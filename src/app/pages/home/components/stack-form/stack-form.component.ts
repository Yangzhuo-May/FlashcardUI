import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StackServiceService } from '../../../../services/stack-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stack-form',
  imports: [
    CommonModule, 
    FormsModule
  ],
  templateUrl: './stack-form.component.html',
  styleUrl: './stack-form.component.css'
})
export class StackFormComponent  implements OnInit  {
  editedStackName: string = '';
  newStackName: string = '';
  editingStack: any = null;

  @Input() isAddFormVisible: boolean = false;
  @Input() isEditFormVisible: boolean = false;
  @Output() closeAddForm = new EventEmitter<void>();
  @Output() closeEditForm = new EventEmitter<void>();

  private dataSubscription: Subscription | undefined;

  constructor(
    private stackService: StackServiceService
  ){}

  ngOnInit(): void {
    this.dataSubscription = this.stackService.editingStack$.subscribe(data => {
      this.editingStack = data;
    });
    this.editedStackName = this.editingStack.stackName;
  }

  closeAdd() {
    this.closeAddForm.emit();
  }

  closeEdit() {
    this.closeEditForm.emit();
  }

  onAddStackClick(): void {
    if (this.newStackName) {
      this.stackService.createStack(this.newStackName).subscribe({
        next: (data) => {
          this.stackService.setData(data.stack); 
          this.closeAddForm.emit();
        },
        error: (error) => this.handleError(error, 'Failed to create Stack. Please try again later.')
      });         
    } else {
      alert('Please enter the Stack name.');
    }
  }

  onEditStackClick() {
    const stackName = this.editedStackName;
    const stackId = this.editingStack.stackId;

    if (stackId == null) {
      alert('Invalid Stack name or ID.');
      return;
    } 

    this.stackService.updateStack(stackName, stackId).subscribe({
      next: (data) => {
        this.stackService.setData(data.stack); 
        this.closeEditForm.emit();
        this.editedStackName = '';
      },
      error: (error) => this.handleError(error, 'Failed to update Stack. Please try again later.')
    })
  }

  handleError(error: any, customMessage: string) {
    console.error(customMessage, error);
    alert(customMessage);
  }
}
