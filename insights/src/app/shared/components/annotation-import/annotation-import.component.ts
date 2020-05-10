import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-annotation-import',
  templateUrl: './annotation-import.component.html',
  styleUrls: ['./annotation-import.component.scss']
})
export class AnnotationImportComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private data: DataService
  ) { }
  form: FormGroup;
  hasAnnotations: boolean;
  annotations: string;

  ngOnInit(): void {
    this.annotations = this.data.loadFromStorage();
    this.hasAnnotations = !!this.annotations;
    this.form = this.fb.group({
      json: ['', Validators.required]
    });
  }

  copied(copied: boolean): void {
    if (copied) {
      this.snackbar.open('Coped to clipboard', 'close');
    }
  }

  submit(): void {
    if (this.form.valid) {
      const stringified = this.data.decompress(this.form.value.json);
      try {
        JSON.parse(stringified);
        this.data.saveToStorage(stringified);
        window.location.reload();
      } catch {
        this.form.reset();
        this.snackbar.open('Annotations couldn\'t be imported', 'close');
      }
    }
  }
}
