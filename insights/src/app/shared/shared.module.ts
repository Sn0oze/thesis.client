import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeybordAnnotationComponent } from './keybord-annotation/keybord-annotation.component';
import { StylusAnnotationComponent } from './stylus-annotation/stylus-annotation.component';



@NgModule({
  declarations: [KeybordAnnotationComponent, StylusAnnotationComponent],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
