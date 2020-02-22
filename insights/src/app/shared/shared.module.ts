import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyboardAnnotationComponent } from './keyboard-annotation/keyboard-annotation.component';
import { StylusAnnotationComponent } from './stylus-annotation/stylus-annotation.component';
import {CalendarComponent} from './visualisations/calendar/calendar.component';

@NgModule({
  declarations: [
    KeyboardAnnotationComponent,
    StylusAnnotationComponent,
    CalendarComponent],
  exports: [
    KeyboardAnnotationComponent,
    StylusAnnotationComponent,
    CalendarComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
