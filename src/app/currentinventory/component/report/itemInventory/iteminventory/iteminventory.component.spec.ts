import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IteminventoryComponent } from './iteminventory.component';

describe('IteminventoryComponent', () => {
  let component: IteminventoryComponent;
  let fixture: ComponentFixture<IteminventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IteminventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IteminventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
