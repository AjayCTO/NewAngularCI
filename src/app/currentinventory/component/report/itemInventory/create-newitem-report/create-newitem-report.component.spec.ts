import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewitemReportComponent } from './create-newitem-report.component';

describe('CreateNewitemReportComponent', () => {
  let component: CreateNewitemReportComponent;
  let fixture: ComponentFixture<CreateNewitemReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewitemReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewitemReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
