import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StylusAnnotationComponent } from './stylus-annotation.component';

describe('StylusAnnotationComponent', () => {
  let component: StylusAnnotationComponent;
  let fixture: ComponentFixture<StylusAnnotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StylusAnnotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StylusAnnotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
