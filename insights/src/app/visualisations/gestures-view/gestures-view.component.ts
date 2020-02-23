import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gestures-view',
  templateUrl: './gestures-view.component.html',
  styleUrls: ['./gestures-view.component.scss']
})
export class GesturesViewComponent implements OnInit {
  event = 'none';

  constructor() { }

  ngOnInit(): void {
  }

  handleGesture(event): void {
    console.log(event);
    this.event = event.type;
    if (event.type.includes('pan')) {
      this.event += ' distance: ' + event.distance.toFixed(0);
    }
  }

}
