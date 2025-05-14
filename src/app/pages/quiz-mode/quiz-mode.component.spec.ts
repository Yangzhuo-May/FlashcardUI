import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizModeComponent } from './quiz-mode.component';

describe('QuizModeComponent', () => {
  let component: QuizModeComponent;
  let fixture: ComponentFixture<QuizModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizModeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
