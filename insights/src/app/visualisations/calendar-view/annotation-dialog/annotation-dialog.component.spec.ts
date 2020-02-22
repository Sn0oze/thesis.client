import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationDialogComponent } from './annotation-dialog.component';

describe('AnnotationDialogComponent', () => {
  let component: AnnotationDialogComponent;
  let fixture: ComponentFixture<AnnotationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnotationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
