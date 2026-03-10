import { Component, Input, OnInit } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-tool-tip',
  templateUrl: './tool-tip.component.html'
})
export class ToolTipTriggerComponent implements OnInit {
  @Input() trigger = '';

  constructor() {}

  ngOnInit() {}
}
