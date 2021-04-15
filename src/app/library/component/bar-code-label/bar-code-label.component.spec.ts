import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarCodeLabelComponent } from './bar-code-label.component';

describe('BarCodeLabelComponent', () => {
  let component: BarCodeLabelComponent;
  let fixture: ComponentFixture<BarCodeLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarCodeLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarCodeLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
