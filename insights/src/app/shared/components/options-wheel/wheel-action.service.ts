import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {WheelAction} from './models';

@Injectable({
  providedIn: 'root'
})
export class WheelActionService {
  action = new BehaviorSubject<WheelAction>('initial');

  constructor() { }
  next(action: WheelAction): void {
    this.action.next(action);
  }
}
