import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoiceModeButtonComponent } from './choice-mode-button.component';

describe('ChoiceModeButtonComponent', () => {
  let component: ChoiceModeButtonComponent;
  let fixture: ComponentFixture<ChoiceModeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoiceModeButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoiceModeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
