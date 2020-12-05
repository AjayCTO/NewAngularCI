import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationLibraryComponent } from './location-library.component';

describe('LocationLibraryComponent', () => {
  let component: LocationLibraryComponent;
  let fixture: ComponentFixture<LocationLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
