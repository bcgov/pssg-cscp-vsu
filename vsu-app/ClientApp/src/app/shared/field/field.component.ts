import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-field',
  templateUrl: './field.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {
  @Input() required = false;
  @Input() showChevrons = true;
  @Input() valid = true;
  @Input() label: string;
  @Input() tooltipReference: string;
  @Input() leadingText: string;
  @Input() errorMessage: string;
  @Input() disabled: boolean;

  constructor() {}

  ngOnInit() {}
}
