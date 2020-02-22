import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {VisualisationsComponent} from './visualisations.component';
import {CalendarViewComponent} from './calendar-view/calendar-view.component';


const routes: Routes = [
  {
    path: '',
    component: VisualisationsComponent,
    children: [
      {path: '', redirectTo: 'calendar', pathMatch: 'full'},
      {
        path: 'calendar',
        component: CalendarViewComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisualisationsRoutingModule { }
