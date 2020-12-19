import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatReportComponent } from './creat-report.component';

describe('CreatReportComponent', () => {
  let component: CreatReportComponent;
  let fixture: ComponentFixture<CreatReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
