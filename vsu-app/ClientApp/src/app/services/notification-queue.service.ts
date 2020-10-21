import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  message: string;
  identifier: string;
  type: string; // 'success' || 'warning' || 'danger'
}

@Injectable({
  providedIn: 'root'
})
export class NotificationQueueService {
  defaultTimeout = 5000;

  public notificationQueue: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);

  addNotification(message: string, type: string = 'warning', timeoutMs: number = this.defaultTimeout) {
    const currentNotifications: Notification[] = this.notificationQueue.getValue();
    const notification: Notification = { message, identifier: new Date().toString(), type };
    currentNotifications.push(notification);
    this.notificationQueue.next(currentNotifications);
    setTimeout(() => {
      this.expireNotification(notification.identifier);
    }, timeoutMs);

  }

  expireNotification(identifier: string) {
    this.notificationQueue.next(this.notificationQueue.getValue().filter((m) => m.identifier !== identifier));
  }
}
