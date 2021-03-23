import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearConfirmationComponent } from './clear-confirmation.component';

describe('ClearConfirmationComponent', () => {
  let component: ClearConfirmationComponent;
  let fixture: ComponentFixture<ClearConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClearConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
