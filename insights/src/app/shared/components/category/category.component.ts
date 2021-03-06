import {Component, Input, OnInit} from '@angular/core';
import {Category} from '../../models';
import {readableFontColor} from '../../utils';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  @Input() category: Category;

  constructor() { }

  ngOnInit(): void {
  }

  readable(hex: string): string {
    return readableFontColor(hex);
  }
}
