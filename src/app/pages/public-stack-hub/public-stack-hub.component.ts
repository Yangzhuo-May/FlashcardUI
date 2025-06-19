import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StackServiceService } from '../../services/stack-service.service';

@Component({
  selector: 'app-public-stack-hub',
  imports: [
    CommonModule
  ],
  templateUrl: './public-stack-hub.component.html',
  styleUrl: './public-stack-hub.component.css'
})
export class PublicStackHubComponent implements OnInit {
  stacks: any[] = [];

  constructor(
    private stackService : StackServiceService
  ) {}

  ngOnInit(): void {
    this.loadStacks();
  }

  loadStacks(): void {
    this.stackService.getPublicStacks().subscribe({
      next: (data) => {
        this.stacks = data;
      },
      error: (error) => this.handleError(error, 'Failed to load Stack data. Please try again later.')
    })
  }

  handleError(error: any, customMessage: string) {
    console.error(customMessage, error);
    alert(customMessage);
  }
}
