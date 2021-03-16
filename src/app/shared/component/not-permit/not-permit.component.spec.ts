import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotPermitComponent } from './not-permit.component';

describe('NotPermitComponent', () => {
  let component: NotPermitComponent;
  let fixture: ComponentFixture<NotPermitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotPermitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotPermitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
