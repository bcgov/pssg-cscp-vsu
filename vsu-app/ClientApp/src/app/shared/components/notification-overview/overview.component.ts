import { Component, Input } from '@angular/core';
import { ApplicationType } from '../../enums-list';

@Component({
  standalone: false,
  selector: 'app-notification-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class NotificationOverviewComponent {
  @Input() formType: ApplicationType;
  constructor() {}
}
