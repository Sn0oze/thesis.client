import { Component, OnInit } from '@angular/core';
import {AnnotationService} from '../../services/annotation.service';
import {CanvasSessionService} from '../../services/canvas-session.service';

@Component({
  selector: 'app-annotation-reset',
  templateUrl: './annotation-reset.component.html',
  styleUrls: ['./annotation-reset.component.scss']
})
export class AnnotationResetComponent implements OnInit {

  constructor(
    private annotations: AnnotationService,
    private session: CanvasSessionService
  ) { }

  ngOnInit(): void {
  }

  reset(): void {
    this.annotations.clear();
    this.session.clear();
    window.location.reload();
  }
}
