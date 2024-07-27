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
    const compressed = this.export();
    if (compressed) {
      const stringified = this.decompress(compressed);
      return JSON.parse(stringified) as Array<Shape>;
    } else {
      return [];
    }
  }

  saveToStorage(session: Array<Shape>): void {
    const stringified = JSON.stringify(session);
    const compressed = this.compress(stringified);
    this.import(compressed);
  }

  compress(stringified: string): string {
    return compression.compressToUTF16(stringified);
  }

  decompress(compressed: string): string {
    return compression.decompressFromUTF16(compressed);
  }

  export(): string {
    return localStorage.getItem(CANVAS_SESSION_KEY);
  }

  import(compressed: string): void {
    localStorage.setItem(CANVAS_SESSION_KEY, compressed);
  }

  clear(): void {
    localStorage.removeItem(CANVAS_SESSION_KEY);
  }
}
