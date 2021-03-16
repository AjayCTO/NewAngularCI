import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditnewCustomReportComponent } from './editnew-custom-report.component';

describe('EditnewCustomReportComponent', () => {
  let component: EditnewCustomReportComponent;
  let fixture: ComponentFixture<EditnewCustomReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditnewCustomReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditnewCustomReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
