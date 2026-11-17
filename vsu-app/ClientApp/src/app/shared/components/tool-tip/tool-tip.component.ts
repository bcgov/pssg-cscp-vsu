import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-tool-tip',
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './tool-tip.component.html'
})
export class ToolTipTriggerComponent implements OnInit {
  @Input() trigger = '';

  constructor() {}

  ngOnInit() {}
}
