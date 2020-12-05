import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrangeColumnComponent } from './arrange-column.component';

describe('ArrangeColumnComponent', () => {
  let component: ArrangeColumnComponent;
  let fixture: ComponentFixture<ArrangeColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrangeColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrangeColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
