import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LockConfirmationComponent } from './lock-confirmation.component';

describe('LockConfirmationComponent', () => {
  let component: LockConfirmationComponent;
  let fixture: ComponentFixture<LockConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LockConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LockConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
