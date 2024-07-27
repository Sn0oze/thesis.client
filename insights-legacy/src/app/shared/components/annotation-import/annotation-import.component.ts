import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Clipboard} from '@angular/cdk/clipboard';
import {AnnotationService} from '../../services/annotation.service';

@Component({
  selector: 'app-annotation-import',
  templateUrl: './annotation-import.component.html',
  styleUrls: ['./annotation-import.component.scss']
})
export class AnnotationImportComponent implements OnInit {
  form: FormGroup;
  stringified: string;

  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private annotations: AnnotationService,
    private clipboard: Clipboard
  ) { }

  ngOnInit(): void {
    this.stringified = this.annotations.loadFromStorage();
    this.form = this.fb.group({
      json: ['', Validators.required]
    });
  }

  copy(): void {
    this.clipboard.copy(this.stringified);
    this.snackbar.open('Copied to clipboard', 'close');
  }

  submit(): void {
    if (this.form.valid) {
      const stringified = this.annotations.decompress(this.form.value.json);
      try {
        JSON.parse(stringified);
        this.annotations.saveToStorage(stringified);
        const snackRef = this.snackbar.open('Data imported! ...', 'close');
        snackRef.afterDismissed().subscribe(() => window.location.reload());
      } catch {
        this.form.reset();
        this.snackbar.open('Annotations couldn\'t be imported', 'close');
      }
    }
  }
}
