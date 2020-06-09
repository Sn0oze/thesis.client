import { Injectable } from '@angular/core';
import {Shape} from '../models';
import * as compression from 'lz-string';
import {CANVAS_SESSION_KEY} from '../constants';

@Injectable({
  providedIn: 'root'
})
export class CanvasSessionService {
  private session = [] as Array<Shape>;

  constructor() {
    this.session = this.loadFromStorage();
  }

  get current(): Array<Shape> {
    return this.session;
  }

  set current(session: Array<Shape>) {
    this.session = session;
  }

  save(session: Array<Shape>): void {
    this.session = session;
    this.saveToStorage(session);
  }

  loadFromStorage(): Array<Shape> {
    const compressed = localStorage.getItem(CANVAS_SESSION_KEY);
    if (compressed) {
      const stringified = compression.decompressFromUTF16(compressed);
      return JSON.parse(stringified) as Array<Shape>;
    } else {
      return [];
    }
  }

  saveToStorage(session: Array<Shape>): void {
    const stringified = JSON.stringify(session);
    const compressed = compression.compressToUTF16(stringified);
    localStorage.setItem(CANVAS_SESSION_KEY, compressed);
  }
}
