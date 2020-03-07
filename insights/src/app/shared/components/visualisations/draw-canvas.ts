import * as d3 from 'd3';
import * as simplify from 'simplify-js';

export class DrawCanvas {
  svg: any;
  line: d3.Line<[number, number]>;
  margin: {top: number, right: number, bottom: number, left: number};
  width: number;
  height: number;
  ptData: any[];
  session: any[];
  path: any;
  drawing: boolean;
  touchEvents: any[];
  color = '#313131';

  constructor(private container: HTMLElement) {
    this.init();
  }

  init(): void {
    this.margin = {top: 0, right: 0, bottom: 0, left: 0};
    this.width = this.container.offsetWidth - this.margin.left - this.margin.right;
    this.height = 618 - this.margin.top - this.margin.bottom;

    this.svg = d3.select(this.container).append('svg').attr('class', 'canvas')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom);

    this.svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.ptData = [];
    this.session = [];
    this.drawing = false;
    this.line = d3.line()
      .x((d: any) => d.x)
      .y((d: any) => d.y)
      .curve(d3.curveBasis);

    this.svg
      .on('mousedown', this.listen.bind(this))
      .on('touchstart', this.listen.bind(this))
      .on('touchend', this.ignore.bind(this))
      .on('touchleave', this.ignore.bind(this))
      .on('mouseup', this.ignore.bind(this))
      .on('mouseleave', this.ignore.bind(this))
      .on('mousemove', this.onmove.bind(this))
      .on('touchmove', this.onmove.bind(this));
  }

  listen(): void {
    this.drawing = true;
    this.ptData = []; // reset point data
    this.path = this.svg.append('path') // start a new line
      .data([this.ptData])
      .attr('class', 'line')
      .attr('d', this.line)
      .style('stroke', 'rgba(50,130,250, .6)');
  }

  ignore(): void {
    // skip out if we're not drawing
    if (!this.drawing) { return; }
    this.drawing = false;

    // simplify
    this.ptData = simplify(this.ptData);

    // add newly created line to the drawing session
    this.session.push(this.ptData);

    // redraw the line after simplification
    this.tick();
  }

  onmove(d, i, n): void {
    const type = d3.event.type;
    let point;

    if (type === 'mousemove') {
      point = d3.mouse(n[i]);
    } else {
      // only deal with a single touch input
      point = d3.touches(n[i])[0];
    }
    // push a new data point onto the back
    this.ptData.push({ x: point[0], y: point[1] });
    this.tick();
  }

  tick(): void {
    this.path.attr('d', d => this.line(d)); // Redraw the path:
  }
}
