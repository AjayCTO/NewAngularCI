import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UOMLibraryComponent } from './uom-library.component';

describe('UOMLibraryComponent', () => {
  let component: UOMLibraryComponent;
  let fixture: ComponentFixture<UOMLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UOMLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UOMLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
