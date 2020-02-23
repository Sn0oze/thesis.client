import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';
import { VisualisationsComponent } from './visualisations.component';
import {VisualisationsRoutingModule} from './visualisations-routing.module';
import {SharedModule} from '../shared/shared.module';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { AnnotationDialogComponent } from './calendar-view/annotation-dialog/annotation-dialog.component';
import { GesturesViewComponent } from './gestures-view/gestures-view.component';
import {MatRippleModule} from '@angular/material/core';



@NgModule({
    declarations: [CalendarViewComponent, VisualisationsComponent, AnnotationDialogComponent, GesturesViewComponent],
    exports: [
      SharedModule
    ],
  imports: [
    CommonModule,
    VisualisationsRoutingModule,
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule
  ]
})
export class VisualisationsModule { }
