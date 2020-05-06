import {Component, OnInit, ViewChild} from '@angular/core';
import {
  Annotation,
  AnnotationDetails,
  CalendarSelection,
  CategorizeSelection,
  DataSet,
  Mode,
  Note,
  ObservationsMap
} from '../../shared/models';
import {ColorConstants, PEN_WIDTHS} from '../../shared/constants';
import {DrawCanvasComponent} from '../../shared/components/visualisations/draw-canvas/draw-canvas.component';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {AnnotationDialogComponent} from './annotation-dialog/annotation-dialog.component';
import {FilterDialogComponent} from './filter-dialog/filter-dialog.component';
import {moment, parseDate} from '../../shared/utils';
import {CategoryService} from '../../shared/services/category.service';
import {ViewDialogComponent} from './view-dialog/view-dialog.component';

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
  colors: Array<string>;
  width: string;
  dataSet: DataSet;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private categories: CategoryService
  ) { }

  ngOnInit(): void {
    this.width = PEN_WIDTHS[0];
    this.color = ColorConstants[0];
    this.colors = this.categories.getCategories().map(category => category.color);
    this.colors.unshift(this.color);
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

  annotate(selection: CalendarSelection): void {
    const dialogRef = this.dialog.open(AnnotationDialogComponent, {
      width: '80vw',
      height: '80vh',
      data: selection
    });
    dialogRef.afterClosed().subscribe((body: string) => {
      if (body) {
        const note = {
          crated: moment().utc().format(),
          body
        } as Note;
        this.addAnnotations(selection.entries, note, 'notes');
        this.dataSet.updateTotals(selection.entries, this.dataSet);
        this.dataSet.save(this.dataSet);
      }
    });
  }

  categorize(selected: CategorizeSelection): void {
    this.addAnnotations(selected.selection.entries, selected.category, 'categories');
    this.dataSet.updateTotals(selected.selection.entries, this.dataSet);
    this.dataSet.save(this.dataSet);
  }

  view(selection: CalendarSelection) {
    const dialogRef = this.dialog.open(ViewDialogComponent, {
      width: '80vw',
      height: '80vh',
      data: this.getAnnotations(selection)
    });
  }

  getAnnotations(selection: CalendarSelection): AnnotationDetails {
    const map = new Map();
    selection.entries.forEach(dateString => {
      const date = parseDate(dateString);
      const annotations = this.dataSet.annotations.get(date.day).get(date.hour);
      map.has(date.day) ? map.get(date.day).set(date.hour, annotations) : map.set(date.day, new Map().set(date.hour, annotations));
    });
    return map;
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

  addAnnotations(entries, data, type: 'notes' | 'categories'): void {
    entries.forEach(time => {
      const annotations = this.dataSet.annotations;
      const firstAnnotation = {notes: [], categories: []} as Annotation;
      firstAnnotation[type].push(data);
      const date = parseDate(time);
      const day = date.day;
      const hour = date.hour;
      if (annotations.has(day)) {
        annotations.get(day).has(hour) ? annotations.get(day).get(hour)[type].push(data) : annotations.get(day).set(hour, firstAnnotation);
      } else {
        annotations.set(day, new Map().set(hour, firstAnnotation));
      }
    });
  }
}
