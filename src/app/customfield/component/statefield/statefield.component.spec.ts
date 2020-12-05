import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatefieldComponent } from './statefield.component';

describe('StatefieldComponent', () => {
  let component: StatefieldComponent;
  let fixture: ComponentFixture<StatefieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatefieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatefieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
