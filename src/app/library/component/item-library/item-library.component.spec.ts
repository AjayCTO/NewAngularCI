import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemLibraryComponent } from './item-library.component';

describe('ItemLibraryComponent', () => {
  let component: ItemLibraryComponent;
  let fixture: ComponentFixture<ItemLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
