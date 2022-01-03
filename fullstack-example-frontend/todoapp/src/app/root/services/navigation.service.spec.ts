import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { NavigationService } from './navigation.service';

describe('NavigationService', () => {
  let service: NavigationService;

  beforeEach(() => {
    const spyRouter = jasmine.createSpyObj('Router', ['events', 'navigate']);
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: spyRouter }
      ]
    });
    service = TestBed.inject(NavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
