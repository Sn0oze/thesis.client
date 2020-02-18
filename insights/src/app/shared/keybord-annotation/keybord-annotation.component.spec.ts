import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeybordAnnotationComponent } from './keybord-annotation.component';

describe('KeybordAnnotationComponent', () => {
  let component: KeybordAnnotationComponent;
  let fixture: ComponentFixture<KeybordAnnotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeybordAnnotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeybordAnnotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
