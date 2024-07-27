import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {WheelAction, WheelData} from './models';

@Injectable({
  providedIn: 'root'
})
export class WheelActionService {
  action = new BehaviorSubject<WheelData>({action: 'initial', data: ''});

  constructor() { }
  next(action: WheelData): void {
    this.action.next(action);
  }
}
