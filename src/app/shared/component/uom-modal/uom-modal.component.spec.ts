import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UomModalComponent } from './uom-modal.component';

describe('UomModalComponent', () => {
  let component: UomModalComponent;
  let fixture: ComponentFixture<UomModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UomModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UomModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
