import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackListComponent } from './stack-list.component';

describe('StackListComponent', () => {
  let component: StackListComponent;
  let fixture: ComponentFixture<StackListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
