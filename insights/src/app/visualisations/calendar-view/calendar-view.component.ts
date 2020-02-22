import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss']
})
export class CalendarViewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  selected(day): void {
    alert('Selected: ' + day.day);
  }

}
