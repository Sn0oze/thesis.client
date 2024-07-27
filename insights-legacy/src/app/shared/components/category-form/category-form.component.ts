import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  @Output() submitted = new EventEmitter<string>();
  @ViewChild('input') input: ElementRef;
  form: FormGroup;
  expanded: boolean;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
        category: ['', Validators.required]
      }
    );
  }

  submit(): void {
    const value = this.form.value;
    if (this.form.valid) {
      this.submitted.emit(value.category);
      this.form.reset();
    }
  }
}
