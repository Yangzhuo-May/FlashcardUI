import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  imports: [
    CommonModule
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

  isFlipped = false;

  constructor(private router : Router) {}

  goLogin() {
    this.router.navigate(['login']);
  }

  isInputFlipped = false;
  isChoiceFlipped = false;

  flipInputCard() {
    this.isInputFlipped = true;
    setTimeout(() => {
      this.isInputFlipped = false;
    }, 3000);
  }

  flipChoiseCard() {
    this.isChoiceFlipped = true;
    setTimeout(() => {
      this.isChoiceFlipped = false;
    }, 3000);
  }

  hoverTimer: any = null;

  onMouseEnter() {
    // 悬停超过 1 秒才翻转
    this.hoverTimer = setTimeout(() => {
      
    }, 1000);
  }

  onMouseLeave() {
    // 离开前取消未触发的悬停计时
    clearTimeout(this.hoverTimer);
  }

}
