import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GesturesViewComponent } from './gestures-view.component';

describe('GesturesViewComponent', () => {
  let component: GesturesViewComponent;
  let fixture: ComponentFixture<GesturesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GesturesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GesturesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
