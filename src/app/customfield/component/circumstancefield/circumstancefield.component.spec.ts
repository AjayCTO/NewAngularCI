import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircumstancefieldComponent } from './circumstancefield.component';

describe('CircumstancefieldComponent', () => {
  let component: CircumstancefieldComponent;
  let fixture: ComponentFixture<CircumstancefieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CircumstancefieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CircumstancefieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
