import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categories = ['Work', 'Weekend', 'Evening', 'Holiday'];

  constructor() { }
   getCategories(): Array<string> {
    return this.categories;
   }
  addCategory(category: string): Array<string> {
    this.categories.unshift(category);
    return this.categories;
  }
}
