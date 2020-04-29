import * as d3 from 'd3';
import {DataSet, DayNest} from '../../models';
import {moment, dateFormat} from '../../utils';
import {BehaviorSubject} from 'rxjs';
import {CELL_WIDTH, SPACING_LEFT, SPACING_RIGHT} from '../../constants';

// moment.locale('da');

export interface TimeSpan {
  start: string;
  end: string;
  position: number;
}

export class Timeline {
  svg: any;
  private margin: { top: number, right: number, bottom: number, left: number };
  private width: number;
  private height: number;
  private xScale: d3.ScaleBand<string>;
  private xAxis: d3.Axis<string>;
  private yScale: d3.ScaleLinear<number, number>;
  // private yAxis: d3.Axis<d3.Numeric>;
  private yAxisGrid: d3.Axis<d3.Numeric>;
  // parseTime = d3.timeParse('%d-%m-%Y');
  private brush: d3.BrushBehavior<any>;
  public selection = new BehaviorSubject<TimeSpan>(null);
  private span = 10;
  private currentSelection: TimeSpan;
  private brushWidth: number;
  private grid: d3.Selection<any, any, any, any>;
  private focus: d3.Selection<any, any, any, any>;
  private brushArea: d3.Selection<any, any, any, any>;

  constructor(private container: HTMLElement, private dataSet: DataSet) {
    this.init();
  }

  init(): void {
    this.svg = d3.select(this.container).append('svg')
      .attr('class', 'timeline');
    this.xScale = d3.scaleBand()
      .padding(.1);
    this.yScale = d3.scaleLinear();
    // Define  axis
    this.xAxis = d3.axisBottom(this.xScale);
    this.brush = d3.brushX()
      .on('brush', this.brushed.bind(this));
    this.focus = this.svg.append('g');

    this.grid = this.svg.append('g')
      .attr('class', 'y grid');

    // Create axes
    this.svg.append('g')
      .attr('class', 'x axis');

    this.svg.selectAll('.bar')
      .data(this.dataSet.days)
      .enter().append('rect')
      .attr('class', 'bar')
      .classed('weekend', d => d.isWeekend);

    this.brushWidth = this.xScale(this.xScale.domain()[this.span]) -  this.xScale(this.xScale.domain()[0]);
    this.brushArea = this.focus.append('g')
      .attr('class', 'brush');

    this.draw();
    d3.selectAll('rect.handle').remove();

    window.addEventListener('resize', () => this.draw());
  }

  draw(): void {
    // recalculate the old brush selection before resizing
    const current = d3.brushSelection(this.brushArea.node()) || [0, 0];
    const width = this.xScale.step() || 1;
    const index = Math.round(current[0] as any / width);

    // resize all the rest
    const svgHeight = 150;
    const svgWidth = this.container.offsetWidth;
    this.span = Math.floor((svgWidth - SPACING_LEFT - SPACING_RIGHT) / CELL_WIDTH);
    this.margin = {top: 8, right: 38, bottom: 20, left: 38};
    this.width = svgWidth - this.margin.left - this.margin.right;
    this.height = svgHeight - this.margin.top - this.margin.bottom;
    this.svg
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    this.xScale
      .range([0, this.width])
      .domain(this.dataSet.daySpan);

    const yMax = d3.max(this.dataSet.days.map((day) => day.total));
    this.yScale = d3.scaleLinear()
      .range([this.height, 0])
      .domain([0, Math.ceil(yMax / 10) * 10]);

    // Define  axis
    const tickValues = this.xScale.domain().filter((day, i) =>
      day.startsWith('01') || i === 0 || i === this.xScale.domain().length - 1);
    this.xAxis
      .ticks(12).tickValues(tickValues)
      .tickFormat(value => moment(value, dateFormat).format('Do MMM'));

    this.yAxisGrid = d3.axisLeft(this.yScale)
      .tickSize(-this.width).ticks(5);

    this.brush
      .extent([[0, 0], [this.width, this.height]]);

    this.focus
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.grid
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`)
      .call(this.yAxisGrid);

    // Create axes
    d3.select('.x.axis')
      .attr('transform', `translate(${this.margin.left},${this.height + this.margin.top})`)
      .call(this.xAxis);

    this.svg.selectAll('.bar')
      .attr('x', d => this.xScale(d.key) + this.margin.left)
      .attr('width', this.xScale.bandwidth())
      .attr('y', d => this.yScale(d.total) + this.margin.top)
      .attr('height', d => this.height - this.yScale(d.total));

    this.brushWidth = this.xScale(this.xScale.domain()[this.span]) -  this.xScale(this.xScale.domain()[0]);
    const start = this.xScale(this.xScale.domain()[index]);
    const max = index + this.span;
    const end = this.xScale(this.xScale.domain()[max]);
    // console.log(index + this.span, this.xScale.domain()[1], end);
    this.brushArea
      .call(this.brush)
      .call(this.brush.move, [start, end])
      .call(g => g.select('.overlay')
        .datum({type: 'selection'})
        .on('mousedown touchstart', this.clicked.bind(this)));
  }

  brushed(): void {
    const event = d3.event as d3.D3BrushEvent<any>;
    // const selection = event.selection.map(point => this.xScale.inv)
    const width = this.xScale.step();
    const index = Math.round(event.selection[0] as any / width);
    const result = {
      start: this.xScale.domain()[index],
      end: this.xScale.domain()[index + this.span],
      position: index
    };
    // only emit the initial selection or if the brush moved to a new day
    if (!this.currentSelection || result.start !== this.currentSelection.start) {
      this.selection.next(result);
    }
    this.currentSelection = result;
  }
  clicked(data, index, nodes): void {
    const self = nodes[index];
    const dx = this.brushWidth;
    const [cx] = d3.mouse(self);
    const [x0, x1] = [cx - dx / 2, cx + dx / 2];
    const [X0, X1] = this.xScale.range();
    d3.select(self.parentNode)
      .call(this.brush.move, x1 > X1 ? [X1 - dx, X1]
        : x0 < X0 ? [X0, X0 + dx]
          : [x0, x1]);
  }
}
