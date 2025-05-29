import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-daily-summary',
  imports: [
    CommonModule
  ],
  templateUrl: './daily-summary.component.html',
  styleUrl: './daily-summary.component.css'
})
export class DailySummaryComponent {
  today = new Date();
}
