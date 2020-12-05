import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentInventoryGridComponent } from './current-inventory-grid.component';

describe('CurrentInventoryGridComponent', () => {
  let component: CurrentInventoryGridComponent;
  let fixture: ComponentFixture<CurrentInventoryGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentInventoryGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentInventoryGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
