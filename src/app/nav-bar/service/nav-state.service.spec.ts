import { TestBed } from '@angular/core/testing';

import { NavStateService } from './nav-state.service';

describe('NavStateService', () => {
  let service: NavStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
