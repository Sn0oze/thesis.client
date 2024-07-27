import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPatchComponent } from './color-patch.component';

describe('ColorPatchComponent', () => {
  let component: ColorPatchComponent;
  let fixture: ComponentFixture<ColorPatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
