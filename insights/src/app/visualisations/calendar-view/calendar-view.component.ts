import {Component, OnInit, ViewChild} from '@angular/core';
import {CalendarCell, DataSet, Mode, ObservationsMap} from '../../shared/models';
import {COLORS, PEN_WIDTHS} from '../../shared/constants';
import {DrawCanvasComponent} from '../../shared/components/visualisations/draw-canvas/draw-canvas.component';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {AnnotationDialogComponent} from './annotation-dialog/annotation-dialog.component';
import {FilterDialogComponent} from './filter-dialog/filter-dialog.component';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss'],
})

export class CalendarViewComponent implements OnInit {
  @ViewChild('canvas') canvas: DrawCanvasComponent;
  body = [] as Array<CalendarCell>[];
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
    /*
    const dialogRef = this.dialog.open(AnnotationDialogComponent, {
      width: '80vw',
      height: '80vh',
      data: {values: Array(80).fill({type: 'test', date: 'none'})}
    });
     */
  }

  selected(selection): void {
    // console.log('Selected: ', selection);
    const dialogRef = this.dialog.open(AnnotationDialogComponent, {
      width: '80vw',
      height: '80vh',
      data: {values: selection}
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed', result);
    });
  }

  viewChecked(): string {
    console.log('view checked');
    return 'view checked';
  }

  isDrawMode(): boolean {
    return this.mode === 'draw';
  }

  undo(): void {
    if (this.canvas) {
      this.canvas.undo();
    }
  }

  annotate(): void {
    const dialogRef = this.dialog.open(AnnotationDialogComponent, {
      width: '80vw',
      height: '80vh',
    });
  }

  filter(observations: ObservationsMap) {
    if (observations.size) {
      const dialogRef = this.dialog.open(FilterDialogComponent, {
        width: '80vw',
        height: '80vh',
        data: observations
      });
    }
  }
}
