import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import {
  CALENDAR_MODE_KEY, CANVAS_SPACING_LEFT,
  CELL_WIDTH,
  ColorConstants,
  PEN_COLOR_KEY, PEN_WIDTH_KEY,
  PEN_WIDTHS,
  SPACING_LEFT,
  SPACING_RIGHT
} from '../../shared/constants';
import {DrawCanvasComponent} from '../../shared/components/visualisations/draw-canvas/draw-canvas.component';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {AnnotationDialogComponent} from './annotation-dialog/annotation-dialog.component';
import {FilterDialogComponent} from './filter-dialog/filter-dialog.component';
import {moment, parseDate} from '../../shared/utils';
import {CategoryService} from '../../shared/services/category.service';
import {ViewDialogComponent} from './view-dialog/view-dialog.component';
import {Subscription} from 'rxjs';
import {SettingsService} from '../../shared/services/settings.service';
import {CalendarComponent} from '../../shared/components/visualisations/calendar/calendar.component';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss'],
})

export class CalendarViewComponent implements OnInit, OnDestroy {
  @ViewChild('canvas') canvas: DrawCanvasComponent;
  @ViewChild('calendar') calendar: CalendarComponent;
  modes = ['select', 'draw'] as Mode[];
  mode = this.getMode();
  color: string;
  colors: Array<string>;
  width: string;
  dataSet: DataSet;
  settings: Subscription;
  showBars: boolean;
  updatedAt = 0;
  canvasWidth: number;
  position = 0;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private categories: CategoryService,
    private appSettings: SettingsService,
  ) { }

  ngOnInit(): void {
    this.width = this.getWidth();
    this.colors = this.categories.getCategories().map(category => category.color);
    this.colors.unshift(ColorConstants[0]);
    this.color = this.getColor();
    this.dataSet = this.route.parent.snapshot.data.dataSet;
    this.settings = this.appSettings.bars.subscribe(value => this.showBars = value);
    this.canvasWidth  = (SPACING_LEFT - CANVAS_SPACING_LEFT) + SPACING_RIGHT + (this.dataSet.daySpan.length * CELL_WIDTH);
  }

  ngOnDestroy() {
    this.settings.unsubscribe();
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
        this.dataSet.updateNoteTotals(selection.entries, this.dataSet);
        this.dataSet.save(this.dataSet);
        const now = moment();
        this.updatedAt = now.milliseconds();
      }
    });
  }

  categorize(selected: CategorizeSelection): void {
    this.addAnnotations(selected.selection.entries, selected.category, 'categories');
    this.dataSet.updateTotals(selected.selection.entries, this.dataSet, selected.category);
    this.dataSet.save(this.dataSet);
    const now = moment();
    this.updatedAt = now.milliseconds();
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

  setMode(mode: Mode): void {
    this.mode = mode;
    localStorage.setItem(CALENDAR_MODE_KEY, mode);
  }

  getMode(): Mode {
    return (localStorage.getItem(CALENDAR_MODE_KEY) || this.modes[0]) as Mode;
  }

  getColor(): string {
    return localStorage.getItem(PEN_COLOR_KEY) || this.colors[0];
  }

  getWidth(): string {
    return localStorage.getItem(PEN_WIDTH_KEY) || PEN_WIDTHS[0];
  }

  scroll(position: number): void {
    this.calendar.scrollTo(position);
    if (this.canvas) {
      this.canvas.scrollTo(position);
    }
    this.position = position;
  }
}
