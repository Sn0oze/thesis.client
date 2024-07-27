import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {BARS_KEY} from '../constants';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  bars = new BehaviorSubject<boolean>(localStorage.getItem(BARS_KEY) === 'true');
  constructor() {}

  toggle(): void {
    const value = !this.bars.value;
    localStorage.setItem(BARS_KEY, String(value));
    this.bars.next(value);
  }
}
