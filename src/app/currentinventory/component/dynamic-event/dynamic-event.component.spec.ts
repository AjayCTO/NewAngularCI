import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicEventComponent } from './dynamic-event.component';

describe('DynamicEventComponent', () => {
  let component: DynamicEventComponent;
  let fixture: ComponentFixture<DynamicEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
