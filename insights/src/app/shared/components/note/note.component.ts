import {Component, Input, OnInit} from '@angular/core';
import {Note} from '../../models';
import {dateFormat, moment} from '../../utils';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {
  @Input() note: Note;
  constructor() { }

  ngOnInit(): void {
  }

  format(date: string, format: string): string {
    return moment(date, dateFormat).format(format);
  }

}
