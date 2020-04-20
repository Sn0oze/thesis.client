import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';
import {fromEvent, Subscription} from 'rxjs';
import {take, filter} from 'rxjs/operators';

export type WheelOption = 'annotate' | 'filter' | 'trim';

@Component({
  selector: 'app-options-wheel',
  templateUrl: './options-wheel.component.html',
  styleUrls: ['./options-wheel.component.scss']
})
export class OptionsWheelComponent implements OnInit, AfterViewInit {
  @Output() trim = new EventEmitter<void>();
  @Output() annotate = new EventEmitter<void>();
  @Output() filter = new EventEmitter<void>();
  /*
  @ViewChild('annotate') annotateRef: ElementRef<HTMLElement>;
  @ViewChild('filter') filterRef: ElementRef<HTMLElement>;
  @ViewChild('trim') trimRef: ElementRef<HTMLElement>;
  annotateElem: HTMLElement;
  filterElem: HTMLElement;
  trimElem: HTMLElement;
   */
  overlayRef: OverlayRef;
  sub: Subscription;
  @ViewChild('wheel') wheel: TemplateRef<any>;
  constructor(
    public overlay: Overlay,
    public viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    /*
    this.annotateElem = this.annotateRef.nativeElement;
    this.annotateElem.addEventListener('touchend', this.startAnnotation);
     */
  }

  startAnnotation(event: TouchEvent): void {
    this.action('annotate');
  }

  startFilter(event: TouchEvent): void {
    this.action('filter');
  }

  startTrim(event: TouchEvent): void {
    this.action('trim');
  }

  action(option: WheelOption): void {
    switch (option) {
      case 'annotate':
        this.annotate.emit();
        break;
      case 'filter':
        this.filter.emit();
        break;
      case 'trim':
        this.trim.emit();
    }
  }

  open(event, user) {
    console.log(typeof event);
    const origin = event.center;
    this.close();
    console.log('wheel', origin);
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(origin)
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        }
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close()
    });

    this.overlayRef.attach(new TemplatePortal(this.wheel, this.viewContainerRef, {
      $implicit: user
    }));
  }
  close(): void {
    if (this.sub) {
      this.sub.unsubscribe();
      if (this.overlayRef) {
        this.overlayRef.dispose();
        this.overlayRef = null;
      }
    } else {
      if (this.overlayRef) {
        this.overlayRef.dispose();
        this.overlayRef = null;
      }
    }
  }
}
