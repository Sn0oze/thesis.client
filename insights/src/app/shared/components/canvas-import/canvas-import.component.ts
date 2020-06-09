import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Clipboard} from '@angular/cdk/clipboard';
import {CanvasSessionService} from '../../services/canvas-session.service';

@Component({
  selector: 'app-canvas-import',
  templateUrl: './canvas-import.component.html',
  styleUrls: ['./canvas-import.component.scss']
})
export class CanvasImportComponent implements OnInit {
  form: FormGroup;
  hasAnnotations: boolean;
  stringified: string;

  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private session: CanvasSessionService,
    private clipboard: Clipboard
  ) { }

  ngOnInit(): void {
    this.stringified = this.session.export();
    this.hasAnnotations = !!this.stringified;
    this.form = this.fb.group({
      compressed: ['', Validators.required]
    });
  }
  copy(): void {
    this.clipboard.copy(this.stringified);
    this.snackbar.open('Copied to clipboard', 'close');
  }

  submit(): void {
    if (this.form.valid) {
      const compressed = this.form.value.compressed;
      const stringified = this.session.decompress(compressed);
      try {
        JSON.parse(stringified);
        this.session.import(compressed);
        const snackRef = this.snackbar.open('Data imported! ...', 'close');
        snackRef.afterDismissed().subscribe(() => window.location.reload());
      } catch {
        this.form.reset();
        this.snackbar.open('Sahpes couldn\'t be imported', 'close');
      }
    }
  }
}
