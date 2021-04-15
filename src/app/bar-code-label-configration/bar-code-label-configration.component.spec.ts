import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarCodeLabelConfigrationComponent } from './bar-code-label-configration.component';

describe('BarCodeLabelConfigrationComponent', () => {
  let component: BarCodeLabelConfigrationComponent;
  let fixture: ComponentFixture<BarCodeLabelConfigrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarCodeLabelConfigrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarCodeLabelConfigrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
