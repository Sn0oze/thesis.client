import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyboardAnnotationComponent } from './components/keyboard-annotation/keyboard-annotation.component';
import { StylusAnnotationComponent } from './components/stylus-annotation/stylus-annotation.component';
import {CalendarComponent} from './components/visualisations/calendar/calendar.component';
import { SwipeCounterComponent } from './components/swipe-counter/swipe-counter.component';
import { DrawCanvasComponent } from './components/visualisations/draw-canvas/draw-canvas.component';
import { CanvasToolbarComponent } from './components/visualisations/draw-canvas/canvas-toolbar/canvas-toolbar.component';
import { ColorPatchComponent } from './components/color-patch/color-patch.component';
import {MatRippleModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@NgModule({
  declarations: [
    KeyboardAnnotationComponent,
    StylusAnnotationComponent,
    CalendarComponent,
    SwipeCounterComponent,
    DrawCanvasComponent,
    CanvasToolbarComponent,
    ColorPatchComponent,
  ],
    exports: [
        KeyboardAnnotationComponent,
        StylusAnnotationComponent,
        CalendarComponent,
        SwipeCounterComponent,
        DrawCanvasComponent,
        CanvasToolbarComponent
    ],
  imports: [
    CommonModule,
    MatRippleModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule
  ]
})
export class SharedModule { }
