import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputModeButtonComponent } from './input-mode-button.component';

describe('InputModeButtonComponent', () => {
  let component: InputModeButtonComponent;
  let fixture: ComponentFixture<InputModeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputModeButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputModeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
