import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationToggleComponent } from './observation-toggle.component';

describe('ObservationToggleComponent', () => {
  let component: ObservationToggleComponent;
  let fixture: ComponentFixture<ObservationToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservationToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
