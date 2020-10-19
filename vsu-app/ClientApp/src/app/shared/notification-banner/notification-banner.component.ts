import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Notification, NotificationQueueService } from '../../services/notification-queue.service';


@Component({
  selector: 'app-notification-banner',
  templateUrl: './notification-banner.component.html',
  styleUrls: ['./notification-banner.component.css'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('fadeAnimation', [

      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({ opacity: 1 })),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [
        style({ opacity: 0 }),
        animate(400)
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave',
        animate(600, style({ opacity: 0 })))
    ])
  ],
})
export class NotificationBannerComponent implements OnInit {

  staticAlertClosed = false;
  successMessage: string;
  currentNotifications: Notification[];

  levels: string[] = ['danger', 'warning', 'success'];

  constructor(
    private notificationQueueService: NotificationQueueService,
  ) { }

  ngOnInit(): void {
    this.notificationQueueService.notificationQueue.subscribe((notifications: Notification[]) => {
      this.currentNotifications = notifications;
    });
  }

  close(notification: Notification) {
    // expire the notification
    this.notificationQueueService.expireNotification(notification.identifier);
  }

}
