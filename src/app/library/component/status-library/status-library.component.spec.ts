import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusLibraryComponent } from './status-library.component';

describe('StatusLibraryComponent', () => {
  let component: StatusLibraryComponent;
  let fixture: ComponentFixture<StatusLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
