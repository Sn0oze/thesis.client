import {Component, OnInit} from '@angular/core';
import {ANNOTATIONS_KEY} from '../../constants';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-annotation-import',
  templateUrl: './annotation-import.component.html',
  styleUrls: ['./annotation-import.component.scss']
})
export class AnnotationImportComponent implements OnInit {
  constructor(private fb: FormBuilder) { }
  form: FormGroup;
  ngOnInit(): void {
    this.form = this.fb.group({
      json: ['', Validators.required]
    });
  }

  getAnnotations(): string {
    return localStorage.getItem(ANNOTATIONS_KEY);
  }

  hasAnnotations(): boolean {
    return !this.getAnnotations();
  }

  reset(): void {
    this.form.reset();
  }
  submit(): void {
    if (this.form.valid) {
      const stringified = this.form.value.json;
      try {
        JSON.parse(stringified);
        localStorage.setItem(ANNOTATIONS_KEY, stringified);
        console.log('imported successfully');
        window.location.reload();
      } catch {
        console.log('invalid data');
      }
    }
  }
}
