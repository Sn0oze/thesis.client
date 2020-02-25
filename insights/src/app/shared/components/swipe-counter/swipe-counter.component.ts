import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-swipe-counter',
  templateUrl: './swipe-counter.component.html',
  styleUrls: ['./swipe-counter.component.scss']
})
export class SwipeCounterComponent implements OnInit {
  value = 3;

  constructor() { }

  ngOnInit(): void {
  }

  increment(): void {
    this.value += 1;
  }

  decrement(): void {
    this.value -= 1;
  }
}
