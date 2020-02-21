import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyboardAnnotationComponent } from './keyboard-annotation.component';

describe('KeyboardAnnotationComponent', () => {
  let component: KeyboardAnnotationComponent;
  let fixture: ComponentFixture<KeyboardAnnotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyboardAnnotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyboardAnnotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
