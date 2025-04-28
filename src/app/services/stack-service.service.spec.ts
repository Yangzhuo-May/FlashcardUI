import { TestBed } from '@angular/core/testing';

import { StackServiceService } from './stack-service.service';

describe('StackServiceService', () => {
  let service: StackServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StackServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
