import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Clipboard} from '@angular/cdk/clipboard';
import {AnnotationService} from '../../services/annotation.service';
import {ANNOTATIONS_KEY} from '../../constants';

@Component({
  selector: 'app-annotation-reset',
  templateUrl: './annotation-reset.component.html',
  styleUrls: ['./annotation-reset.component.scss']
})
export class AnnotationResetComponent implements OnInit {

  constructor(
    private snackbar: MatSnackBar,
    private annotations: AnnotationService,
    private clipboard: Clipboard
  ) { }

  ngOnInit(): void {
  }

  resetAnnotations(): void {
    const stringified = this.annotations.loadFromStorage();
    if (stringified) {
      this.clipboard.copy(stringified);
    }
    localStorage.removeItem(ANNOTATIONS_KEY);
    const snackRef = this.snackbar.open('Annotations cleared! A copy was saved to the clipboard ...', 'close');
    snackRef.afterDismissed().subscribe(() => window.location.reload());
  }

}
