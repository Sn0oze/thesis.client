import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationImportComponent } from './annotation-import.component';

describe('AnnotationImportComponent', () => {
  let component: AnnotationImportComponent;
  let fixture: ComponentFixture<AnnotationImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnotationImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
