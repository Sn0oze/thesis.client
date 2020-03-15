import * as d3 from 'd3';
import {extendMoment} from 'moment-range';
import * as Moment from 'moment';
import {DataSet, DayNest} from '../../models';

export const timeFormat = 'DD-MM-YYYY';
const moment = extendMoment(Moment);
// moment.locale('da');

export class Timeline {
  svg: any;
  private margin: {top: number, right: number, bottom: number, left: number};
  private width: number;
  private height: number;
  private xScale: d3.ScaleBand<string>;
  private xAxis: d3.Axis<string>;
  private yScale: d3.ScaleLinear<number, number>;
  // private yAxis: d3.Axis<d3.Numeric>;
  private yAxisGrid: d3.Axis<d3.Numeric>;
  // parseTime = d3.timeParse('%d-%m-%Y');
  private brush: d3.BrushBehavior<any>;

  constructor(private container: HTMLElement, private dataSet: DataSet) {
    this.init();
  }
  init(): void {
    const svgHeight = 150;
    const svgWidth = this.container.offsetWidth;
    this.margin = {top: 8, right: 8, bottom: 20, left: 32};
    this.width = svgWidth - this.margin.left - this.margin.right;
    this.height = svgHeight - this.margin.top - this.margin.bottom;
    this.svg = d3.select(this.container).append('svg')
      .attr('class', 'timeline')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    // adding one day is a workaround because the last day is excluded for some reason
    const range = moment.range(
      this.dataSet.min.utc().startOf('day'), this.dataSet.max.utc().endOf( 'day'));
    const xDomain = Array.from(range.by('day'), m => m.format(timeFormat));

    const now = moment();
    const then = now.clone().add(57, 'day');
    const range2 = moment.range(now, then);
    this.xScale = d3.scaleBand()
      .range([0, this.width])
      .domain(xDomain)
      .padding(.1);

    const yMax = d3.max(this.dataSet.days.map((day) => day.total));
    this.yScale = d3.scaleLinear()
      .range([this.height, 0])
      .domain([0, Math.ceil(yMax / 10) * 10]);

    // Define  axis
    const tickValues = this.xScale.domain().filter(day => day.startsWith('01'));
    this.xAxis = d3.axisBottom(this.xScale)
      .ticks(12).tickValues(tickValues)
      .tickFormat(value => moment(value, timeFormat).format('MMMM'));
    // this.yAxis = d3.axisLeft(this.yScale).ticks(4);

    this.yAxisGrid = d3.axisLeft(this.yScale).tickSize(-this.width).ticks(5);

    const focus = this.svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.brush = d3.brushX()
      .extent([[0, 0], [this.width, this.height]])
      .on('brush', this.brushed.bind(this));

    this.svg.append('g')
      .attr('class', 'y grid')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`)
      .call(this.yAxisGrid);

    // Create axes
    this.svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(${this.margin.left},${this.height + this.margin.top})`)
      .call(this.xAxis);
    /*
    this.svg.append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`)
      .call(this.yAxis);
     */

    this.svg.selectAll('.bar')
      .data(this.dataSet.days)
      .enter().append('rect')
      .attr('class', 'bar');

    this.svg.selectAll('.bar')
      .data(this.dataSet.days)
      .attr('x', d => this.xScale(d.key) + this.margin.left)
      .attr('width', this.xScale.bandwidth())
      .attr('y',  d => this.yScale(d.total) + this.margin.top)
      .attr('height', d => this.height - this.yScale(d.total));

    const brushArea = focus.append('g')
      .attr('class', 'brush')
      .call(this.brush);
    const selection = d3.selectAll('.bar').filter((d: DayNest) => d.key.includes('-11-2016'));
    console.log(selection);
    brushArea.call(this.brush.move, [this.xScale('01-11-2016'), this.xScale('20-11-2016')]);
  }

  brushed(event: d3.D3BrushEvent<any>): void {
    console.log('brushed');
  }
}
