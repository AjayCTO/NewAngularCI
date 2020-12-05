import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConfirmation2Component } from './delete-confirmation2.component';

describe('DeleteConfirmation2Component', () => {
  let component: DeleteConfirmation2Component;
  let fixture: ComponentFixture<DeleteConfirmation2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteConfirmation2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteConfirmation2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
