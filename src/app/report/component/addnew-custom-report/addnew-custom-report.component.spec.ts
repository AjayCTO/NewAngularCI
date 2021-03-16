import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnewCustomReportComponent } from './addnew-custom-report.component';

describe('AddnewCustomReportComponent', () => {
  let component: AddnewCustomReportComponent;
  let fixture: ComponentFixture<AddnewCustomReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddnewCustomReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddnewCustomReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
