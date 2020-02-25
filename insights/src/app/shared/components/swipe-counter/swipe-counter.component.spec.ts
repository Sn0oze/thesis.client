import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipeCounterComponent } from './swipe-counter.component';

describe('SwipeCounterComponent', () => {
  let component: SwipeCounterComponent;
  let fixture: ComponentFixture<SwipeCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwipeCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwipeCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
