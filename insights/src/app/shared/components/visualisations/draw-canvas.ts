import * as d3 from 'd3';
import * as simplify from 'simplify-js';
import {ColorConstants, PEN_WIDTHS} from '../../constants';
import {CanvasEvent, Shape} from '../../models';
import {BehaviorSubject} from 'rxjs';

export class DrawCanvas {
  private svg: any;
  private line: d3.Line<[number, number]>;
  private margin: {top: number, right: number, bottom: number, left: number};
  private width: number;
  private height: number;
  private ptData: Array<any>;
  private path: any;
  private drawing: boolean;
  public changed = new BehaviorSubject<CanvasEvent>(null);

  constructor(
    private container: HTMLElement,
    public color = ColorConstants[0], // 'rgba(50,130,250, .6)'
    public strokeWidth = PEN_WIDTHS[0],
    public canvasWidth: number,
    public session = [] as Array<Shape>
  ) {
    this.init();
  }

  public undo(): void {
    const shape = this.session.pop();
    d3.selectAll('.line').data(this.session).exit().remove();
    this.changed.next({shape, action: 'removed'});
  }

  public clear(): void {
    this.session = [];
    this.ptData = [];
    d3.selectAll('.line').remove();
  }

  init(): void {
    const overlayHeight = 638;
    this.margin = {top: 0, right: 0, bottom: 0, left: 0};
    this.width = this.container.offsetWidth - this.margin.left - this.margin.right;
    this.width = this.canvasWidth;
    this.height = overlayHeight - this.margin.top - this.margin.bottom;

    this.svg = d3.select(this.container).append('svg').attr('class', 'canvas')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom);

    this.svg.append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    this.ptData = [];
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

    this.clear.bind(this);
    this.undo.bind(this);
    this.session.forEach(shape => {
      this.path = this.svg.append('path') // start a new line
        .data([shape.line])
        .attr('class', 'line')
        .attr('d', this.line)
        .style('stroke', shape.color)
        .style('stroke-width', shape.stroke);
    });
  }

  private listen(): void {
    this.drawing = true;
    this.ptData = []; // reset point data
    this.path = this.svg.append('path') // start a new line
      .data([this.ptData])
      .attr('class', 'line')
      .attr('d', this.line)
      .style('stroke', this.color)
      .style('stroke-width', this.strokeWidth);
  }

  private ignore(): void {
    // skip out if we're not drawing
    if (!this.drawing) { return; }
    this.drawing = false;

    // simplify
    this.ptData = simplify(this.ptData);

    // add newly created line to the drawing session
    const shape = {
      line: this.ptData,
      stroke: this.strokeWidth,
      color: this.color
    };

    this.session.push(shape);

    // redraw the line after simplification
    this.tick();
    this.changed.next({shape, action: 'added'});
  }

  private onmove(data, index, nodes): void {
    if (this.drawing) {
      const type = d3.event.type;
      let point;

      if (type === 'mousemove') {
        point = d3.mouse(nodes[index]);
      } else {
        // only deal with a single touch input
        point = d3.touches(nodes[index])[0];
      }
      // push a new data point onto the back
      this.ptData.push({ x: point[0], y: point[1] });
      this.tick();
    }
  }

  private tick(): void {
    this.path.attr('d', d => this.line(d)); // Redraw the path:
  }
}
