import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsWheelComponent } from './options-wheel.component';

describe('OptionsWheelComponent', () => {
  let component: OptionsWheelComponent;
  let fixture: ComponentFixture<OptionsWheelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsWheelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsWheelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
