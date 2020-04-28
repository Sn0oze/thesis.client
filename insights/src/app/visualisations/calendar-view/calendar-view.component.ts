import {Component, OnInit, ViewChild} from '@angular/core';
import {Annotation, CalendarSelection, DataSet, Mode, Note, ObservationsMap} from '../../shared/models';
import {COLORS, PEN_WIDTHS} from '../../shared/constants';
import {DrawCanvasComponent} from '../../shared/components/visualisations/draw-canvas/draw-canvas.component';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {AnnotationDialogComponent} from './annotation-dialog/annotation-dialog.component';
import {FilterDialogComponent} from './filter-dialog/filter-dialog.component';
import {dateFormat, hourFormat, moment, timeFrameFormat} from '../../shared/utils';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss'],
})

export class CalendarViewComponent implements OnInit {
  @ViewChild('canvas') canvas: DrawCanvasComponent;
  modes = ['select', 'draw'] as Mode[];
  mode = this.modes[0] as Mode;
  color: string;
  width: string;
  dataSet: DataSet;

  constructor(private route: ActivatedRoute, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.width = PEN_WIDTHS[0];
    this.color = COLORS[0];
    this.dataSet = this.route.parent.snapshot.data.dataSet;
  }

  isDrawMode(): boolean {
    return this.mode === 'draw';
  }

  undo(): void {
    if (this.canvas) {
      this.canvas.undo();
    }
  }

  annotate(timeFrame: CalendarSelection): void {
    const dialogRef = this.dialog.open(AnnotationDialogComponent, {
      width: '80vw',
      height: '80vh',
      data: timeFrame
    });
    dialogRef.afterClosed().subscribe((body: string) => {
      timeFrame.entries.forEach(time => {
        const annotations = this.dataSet.annotations;
        const note = {
          crated: moment().utc().format(),
          body
        } as Note;
        const annotation = {notes: [note], categories: []} as Annotation;
        const date = moment(time, timeFrameFormat);
        const day = date.format(dateFormat);
        const hour = date.format(hourFormat);
        if (annotations.has(day)) {
          annotations.get(day).has(hour) ?
            annotations.get(day).get(hour).notes.push(note) : annotations.get(day).set(hour, annotation);
        } else {
          annotations.set(day, new Map().set(hour, annotation));
        }
      });
    });
  }

  filter(observations: ObservationsMap) {
    if (observations.size) {
      const dialogRef = this.dialog.open(FilterDialogComponent, {
        width: '80vw',
        height: '80vh',
        data: observations
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
      });
    }
  }
}
