import { Injectable } from '@angular/core';
import {Category} from '../models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categories = [
    {
      name: 'Work',
      color: '#4c81c1'
    },
    {
      name: 'Weekend',
      color: '#900c3f'
    },
    {
      name: 'Evening',
      color: '#95ba8a'
    },
    {
      name: 'Holiday',
      color: '#de7119'
    }
  ] as Array<Category>;

  private mappings = {};

  constructor() {
    this.categories.forEach(category => this.mappings[category.name] = category.color);
  }
   getCategories(): Array<Category> {
    return this.categories;
   }
  addCategory(category: Category): Array<Category> {
    this.categories.unshift(category);
    return this.categories;
  }
  colorByName(name: string): string {
    return this.mappings[name];
  }
}
