import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputModeComponent } from './input-mode.component';

describe('InputModeComponent', () => {
  let component: InputModeComponent;
  let fixture: ComponentFixture<InputModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputModeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
