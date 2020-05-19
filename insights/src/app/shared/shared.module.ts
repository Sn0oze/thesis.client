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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TimelineComponent } from './components/visualisations/timeline/timeline.component';
import { OptionsWheelComponent } from './components/options-wheel/options-wheel.component';
import {MatMenuModule} from '@angular/material/menu';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { ObservationToggleComponent } from './components/observation-toggle/observation-toggle.component';
import { DialogHeaderComponent } from './components/dialog-header/dialog-header.component';
import {MatDialogModule} from '@angular/material/dialog';
import { NoteComponent } from './components/note/note.component';
import { CategoryComponent } from './components/category/category.component';
import { AnnotationImportComponent } from './components/annotation-import/annotation-import.component';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { SummaryCalendarComponent } from './components/visualisations/summary-calendar/summary-calendar.component';


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
    CategoryFormComponent,
    ObservationToggleComponent,
    DialogHeaderComponent,
    NoteComponent,
    CategoryComponent,
    AnnotationImportComponent,
    SummaryCalendarComponent
  ],
  imports: [
    CommonModule,
    MatRippleModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    FormsModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatDialogModule,
    ClipboardModule,
    MatSnackBarModule
  ],
  exports: [
    KeyboardAnnotationComponent,
    StylusAnnotationComponent,
    CalendarComponent,
    SwipeCounterComponent,
    DrawCanvasComponent,
    CanvasToolbarComponent,
    TimelineComponent,
    OptionsWheelComponent,
    MatMenuModule,
    DialogHeaderComponent,
    ObservationToggleComponent,
    NoteComponent,
    CategoryComponent,
    AnnotationImportComponent,
    SummaryCalendarComponent
  ],
})
export class SharedModule { }
