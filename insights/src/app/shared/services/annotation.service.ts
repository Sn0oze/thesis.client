import { Injectable } from '@angular/core';
import {AnnotationMap, DataSet} from '../models';
import {ANNOTATIONS_KEY} from '../constants';
import * as compression from 'lz-string';

@Injectable({
  providedIn: 'root'
})
export class AnnotationService {

  constructor() { }

  saveAnnotations(dataset: DataSet): void {
    const stringified = this.mapToJson(dataset.annotations);
    this.saveToStorage(stringified);
  }

  initAnnotations(): AnnotationMap {
    const existing = this.loadFromStorage(false);
    return existing ? this.jsonToMap(existing) : new Map();
  }
  saveToStorage(stringified: string, compressed = true): void {
    const value = compressed ? this.compress(stringified) : stringified;
    localStorage.setItem(ANNOTATIONS_KEY, value);
  }

  loadFromStorage(compressed = true): string {
    const value = localStorage.getItem(ANNOTATIONS_KEY);
    try {
      // this only succeeds if the stored value is an uncompressed json string
      JSON.parse(value);
      this.saveToStorage(value);
      return  compressed ? this.compress(value) : value;
    } catch {
      return  compressed ? value : this.decompress(value);
    }
  }

  decompress(value: string): string {
    return compression.decompressFromUTF16(value);
  }

  compress(value: string): string {
    return compression.compressToUTF16(value);
  }

  mapToJson(map: Map<any, any>) {
    const res = Array.from(map.entries()).map(([k, v]) => [k, [...v]]);
    return JSON.stringify([...res]);
  }
  jsonToMap(jsonStr): Map<any, any> {
    const nested = JSON.parse(jsonStr).map(([k, v]) => [k, new Map(v)]);
    return new Map(nested);
  }
}
