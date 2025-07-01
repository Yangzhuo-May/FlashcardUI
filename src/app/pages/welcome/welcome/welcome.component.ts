import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import TypeIt from 'typeit';

@Component({
  selector: 'app-welcome',
  imports: [
    CommonModule
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent implements AfterViewInit {

  isFlipped = false;
  typeInstance: any;
  isInputCorrect = false;

  isChoiseCorrect = false;
  isChoiseIncorrect = false;

  constructor(private router : Router) {}

  goLogin() {
    this.router.navigate(['login']);
  }

  isInputFlipped = false;
  isChoiceFlipped = false;

  flipInputCard() {
    this.isInputFlipped = true;
    this.isInputCorrect = false;

    setTimeout(() => {
      this.isInputCorrect = true;
    }, 1000);

    setTimeout(() => {
      this.isInputFlipped = false;
      this.isInputCorrect = false;
      this.startTypingAnimation();
    }, 3000);
  }

  flipChoiseCard(answer: number) {
    this.isChoiceFlipped = true;

    this.isChoiseCorrect = false;
    this.isChoiseIncorrect = false;

    setTimeout(() => {
      if (answer == 4) {
        this.isChoiseCorrect = true;
      } else {
        this.isChoiseIncorrect = true;
      }
    }, 1000);
    setTimeout(() => {
      this.isChoiceFlipped = false;
      this.isChoiseCorrect = false;
      this.isChoiseIncorrect = false;
    }, 3000);
  }

  hoverTimer: any = null;

  onMouseEnter() {
    this.hoverTimer = setTimeout(() => {
      
    }, 1000);
  }

  onMouseLeave() {
    // 离开前取消未触发的悬停计时
    clearTimeout(this.hoverTimer);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.startTypingAnimation();
    }, 3000);
  }

  startTypingAnimation() {
    if (this.typeInstance) {
      this.typeInstance.destroy();
    }

    this.typeInstance = new TypeIt("#type-target", {
      strings: ["Bruxelles"],
      speed: 100,
      breakLines: false,
      loop: false
    }).go();
  }
}
