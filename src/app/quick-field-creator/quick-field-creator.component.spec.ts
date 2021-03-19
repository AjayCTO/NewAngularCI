import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickFieldCreatorComponent } from './quick-field-creator.component';

describe('QuickFieldCreatorComponent', () => {
  let component: QuickFieldCreatorComponent;
  let fixture: ComponentFixture<QuickFieldCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickFieldCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickFieldCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
