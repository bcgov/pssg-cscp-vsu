import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ApplicationType } from '../../enums-list';

@Component({
  standalone: false,
  selector: 'app-notification-overview',
  templateUrl: './overview.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./overview.component.scss']
})
export class NotificationOverviewComponent {
  @Input() formType: ApplicationType;
  constructor() {}
}
