import { TestBed } from '@angular/core/testing';

import { CommanSharedService } from '../service/comman-shared.service';

describe('CommanSharedService', () => {
  let service: CommanSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommanSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
