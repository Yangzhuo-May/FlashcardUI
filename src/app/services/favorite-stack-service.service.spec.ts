import { TestBed } from '@angular/core/testing';

import { FavoriteStackServiceService } from './favorite-stack-service.service';

describe('FavoriteStackServiceService', () => {
  let service: FavoriteStackServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoriteStackServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
