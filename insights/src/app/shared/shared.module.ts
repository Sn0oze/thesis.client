import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyboardAnnotationComponent } from './components/keyboard-annotation/keyboard-annotation.component';
import { StylusAnnotationComponent } from './components/stylus-annotation/stylus-annotation.component';
import {CalendarComponent} from './components/visualisations/calendar/calendar.component';
import { SwipeCounterComponent } from './components/swipe-counter/swipe-counter.component';
import { DrawCanvasComponent } from './components/visualisations/draw-canvas/draw-canvas.component';

@NgModule({
  declarations: [
    KeyboardAnnotationComponent,
    StylusAnnotationComponent,
    CalendarComponent,
    SwipeCounterComponent,
    DrawCanvasComponent],
    exports: [
        KeyboardAnnotationComponent,
        StylusAnnotationComponent,
        CalendarComponent,
        SwipeCounterComponent,
        DrawCanvasComponent
    ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
