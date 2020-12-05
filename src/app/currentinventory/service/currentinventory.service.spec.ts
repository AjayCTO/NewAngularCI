import { TestBed } from '@angular/core/testing';

import { CurrentinventoryService } from './currentinventory.service';

describe('CurrentinventoryService', () => {
  let service: CurrentinventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentinventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
