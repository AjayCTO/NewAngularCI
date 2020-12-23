import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFieldModalComponent } from './custom-field-modal.component';

describe('CustomFieldModalComponent', () => {
  let component: CustomFieldModalComponent;
  let fixture: ComponentFixture<CustomFieldModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomFieldModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFieldModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
