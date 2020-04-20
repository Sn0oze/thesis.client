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
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {FormsModule} from '@angular/forms';
import { TimelineComponent } from './components/visualisations/timeline/timeline.component';
import { OptionsWheelComponent } from './components/options-wheel/options-wheel.component';

@NgModule({
  declarations: [
    KeyboardAnnotationComponent,
    StylusAnnotationComponent,
    CalendarComponent,
    SwipeCounterComponent,
    DrawCanvasComponent,
    CanvasToolbarComponent,
    ColorPatchComponent,
    TimelineComponent,
    OptionsWheelComponent,
  ],
    exports: [
        KeyboardAnnotationComponent,
        StylusAnnotationComponent,
        CalendarComponent,
        SwipeCounterComponent,
        DrawCanvasComponent,
        CanvasToolbarComponent,
        TimelineComponent,
        OptionsWheelComponent
    ],
  imports: [
    CommonModule,
    MatRippleModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    FormsModule
  ]
})
export class SharedModule { }
