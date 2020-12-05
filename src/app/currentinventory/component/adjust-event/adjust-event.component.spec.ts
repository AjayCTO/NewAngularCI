import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustEventComponent } from './adjust-event.component';

describe('AdjustEventComponent', () => {
  let component: AdjustEventComponent;
  let fixture: ComponentFixture<AdjustEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjustEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
