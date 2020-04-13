import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-options-wheel',
  templateUrl: './options-wheel.component.html',
  styleUrls: ['./options-wheel.component.scss']
})
export class OptionsWheelComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  action(event): void {
    console.log(event);
  }

  open(): void {
    console.log('open');
  }
}
