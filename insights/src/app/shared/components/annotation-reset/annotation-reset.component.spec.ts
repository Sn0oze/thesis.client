import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationResetComponent } from './annotation-reset.component';

describe('AnnotationResetComponent', () => {
  let component: AnnotationResetComponent;
  let fixture: ComponentFixture<AnnotationResetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnotationResetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
