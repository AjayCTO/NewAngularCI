import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveAndChangeEventComponent } from './move-and-change-event.component';

describe('MoveAndChangeEventComponent', () => {
  let component: MoveAndChangeEventComponent;
  let fixture: ComponentFixture<MoveAndChangeEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveAndChangeEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveAndChangeEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
