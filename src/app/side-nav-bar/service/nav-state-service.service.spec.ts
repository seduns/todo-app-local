import { TestBed } from '@angular/core/testing';

import { NavStateServiceService } from './nav-state-service.service';

describe('NavStateServiceService', () => {
  let service: NavStateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavStateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
