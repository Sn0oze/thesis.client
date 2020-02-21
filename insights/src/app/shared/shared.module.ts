import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyboardAnnotationComponent } from './keyboard-annotation/keyboard-annotation.component';
import { StylusAnnotationComponent } from './stylus-annotation/stylus-annotation.component';



@NgModule({
  declarations: [KeyboardAnnotationComponent, StylusAnnotationComponent],
  exports: [
    KeyboardAnnotationComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
