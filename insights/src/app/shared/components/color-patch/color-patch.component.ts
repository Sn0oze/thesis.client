import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-color-patch',
  templateUrl: './color-patch.component.html',
  styleUrls: ['./color-patch.component.scss']
})
export class ColorPatchComponent implements OnInit {
  @Input() color: string;
  @Input() active: boolean;
  constructor() { }

  ngOnInit(): void {
  }

}
