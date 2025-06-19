import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicStackHubComponent } from './public-stack-hub.component';

describe('PublicStackHubComponent', () => {
  let component: PublicStackHubComponent;
  let fixture: ComponentFixture<PublicStackHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicStackHubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicStackHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
