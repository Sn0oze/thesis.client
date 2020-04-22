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
      }, {updateOn: 'blur'});
  }

  toggle(): void {
    this.expanded = !this.expanded;
  }

  toggleInput(event): void {
    event.stopPropagation();
    this.toggle();
    if (this.expanded) {
      setTimeout(() => {
        const element = this.input.nativeElement;
        element.focus();
        element.select();
        element.prompt();
      }, 0);
    }
  }

  log(event): void {
    console.log('logged');
  }

  submit(): void {
    console.log(this.form.valid, this.form.value);
  }
}
