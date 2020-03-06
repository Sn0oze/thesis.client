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
  listen: () => void;
  ignore: () => void;
  onmove: (d: any, i: any, n: any) => void;
  tick: () => void;

  constructor(private container: HTMLElement) {
    this.listen = () => {
      this.drawing = true;
      this.ptData = []; // reset point data
      this.path = this.svg.append('path') // start a new line
        .data([this.ptData])
        .attr('class', 'line')
        .attr('d', this.line);

      if (d3.event.type === 'mousedown') {
        this.svg.on('mousemove', this.onmove);
      } else {
        this.svg.on('touchmove', this.onmove);
      }
    };

    this.ignore = () => {
      console.log('lemem', this);
      this.svg.on('mousemove', null);
      this.svg.on('touchmove', null);

      // skip out if we're not drawing
      if (!this.drawing) { return; }
      this.drawing = false;

      // simplify
      this.ptData = simplify(this.ptData);

      // add newly created line to the drawing session
      this.session.push(this.ptData);

      // redraw the line after simplification
      this.tick();
    };

    this.onmove = (d, i, n) => {
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
    };

    this.tick = () => {
      this.path.attr('d', d => this.line(d)); // Redraw the path:
    };

    this.init();
  }

  init(): void {
    this.margin = {top: 0, right: 0, bottom: 0, left: 0};
    this.width = this.container.offsetWidth - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;

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
      .on('mousedown', this.listen)
      .on('touchstart', this.listen)
      .on('touchend', this.ignore)
      .on('touchleave', this.ignore)
      .on('mouseup', this.ignore)
      .on('mouseleave', this.ignore);

    // ignore default touch behavior
    this.touchEvents = ['touchstart', 'touchmove', 'touchend'];
  }
}
