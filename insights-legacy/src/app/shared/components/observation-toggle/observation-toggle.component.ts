import {Component, Input, OnInit} from '@angular/core';
import {Observation} from '../../models';

@Component({
  selector: 'app-observation-toggle',
  templateUrl: './observation-toggle.component.html',
  styleUrls: ['./observation-toggle.component.scss']
})
export class ObservationToggleComponent implements OnInit {
  @Input() observation: Observation;

  constructor() { }

  ngOnInit(): void {
  }

  exclude(): void {
    this.observation.exclude = true;
  }

  include(): void {
    this.observation.exclude = false;
  }
  toggle(): void {
    this.observation.exclude = !this.observation.exclude;
  }
}
