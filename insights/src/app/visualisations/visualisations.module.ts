import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';
import { VisualisationsComponent } from './visualisations.component';
import {VisualisationsRoutingModule} from './visualisations-routing.module';
import {SharedModule} from '../shared/shared.module';



@NgModule({
    declarations: [CalendarViewComponent, VisualisationsComponent],
    exports: [
      SharedModule
    ],
    imports: [
      CommonModule,
      VisualisationsRoutingModule,
      SharedModule
    ]
})
export class VisualisationsModule { }
