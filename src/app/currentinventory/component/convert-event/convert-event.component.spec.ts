import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertEventComponent } from './convert-event.component';

describe('ConvertEventComponent', () => {
  let component: ConvertEventComponent;
  let fixture: ComponentFixture<ConvertEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvertEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
