import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CardServiceService } from '../../../../services/card-service.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-viewer',
  imports: [
    CommonModule,
  ],
  templateUrl: './card-viewer.component.html',
  styleUrl: './card-viewer.component.css'
})
export class CardViewerComponent implements OnInit{
  cards: any[] = [];
  rootStackId: number = 0;
  private dataSubscription: Subscription | undefined;
  currentCardIndex: number = 0; 
  isFlipped = false;

  @ViewChild('slideContainer', { static: false }) slideContainer!: ElementRef<HTMLDivElement>;

  constructor(
    private cardService: CardServiceService,
  ) {}

  ngOnInit(): void {
    this.dataSubscription = this.cardService.dataList$.subscribe(data => {
      this.cards = data.cards;
      this.rootStackId = data.stackId;
    })
  }

  ngAfterViewInit(): void {
    this.scrollSlides(this.currentCardIndex);
  }

  scrollSlides(direction: number): void {
    console.log('calling');
    const container = document.getElementById("slideContainer");
    if (container) {
      const slideWidth = 320;
      container.scrollBy({
        left: direction * slideWidth,
        behavior: 'smooth'
      });
    }
  }

  flipCard() {
    this.isFlipped = true;
    setTimeout(() => {
      this.isFlipped = false;
      setTimeout(() => { 
        
      },200); 
    }, 3000);
  }

}
