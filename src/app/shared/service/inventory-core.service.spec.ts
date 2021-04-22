import { TestBed } from '@angular/core/testing';

import { InventoryCoreService } from './inventory-core.service';

describe('InventoryCoreService', () => {
  let service: InventoryCoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryCoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
