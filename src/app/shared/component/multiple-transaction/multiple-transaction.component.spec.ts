import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleTransactionComponent } from './multiple-transaction.component';

describe('MultipleTransactionComponent', () => {
  let component: MultipleTransactionComponent;
  let fixture: ComponentFixture<MultipleTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
