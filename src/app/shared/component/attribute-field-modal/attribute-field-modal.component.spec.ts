import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeFieldModalComponent } from './attribute-field-modal.component';

describe('AttributeFieldModalComponent', () => {
  let component: AttributeFieldModalComponent;
  let fixture: ComponentFixture<AttributeFieldModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeFieldModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeFieldModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
