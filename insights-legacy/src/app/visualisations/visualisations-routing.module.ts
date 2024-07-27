import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {VisualisationsComponent} from './visualisations.component';
import {CalendarViewComponent} from './calendar-view/calendar-view.component';
import {GesturesViewComponent} from './gestures-view/gestures-view.component';
import {DataResolver} from '../shared/resolvers/data.resolver';


const routes: Routes = [
  {
    path: '',
    component: VisualisationsComponent,
    resolve: {
      dataSet: DataResolver
    },
    children: [
      {path: '', redirectTo: 'calendar', pathMatch: 'full'},
      {path: 'calendar', component: CalendarViewComponent},
      {path: 'gestures', component: GesturesViewComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisualisationsRoutingModule { }
