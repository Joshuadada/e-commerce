import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

@Injectable({
  providedIn: 'root'
})

export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  // Simple function to generate a unique ID
  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  // Show a new notification; the notification auto-hides after 3 seconds.
  show(notification: Omit<Notification, 'id'>, autoHide = 3000): void {
    const newNotification: Notification = { ...notification, id: this.generateId() };
    const notifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...notifications, newNotification]);

    // Auto-remove after autoHide milliseconds (if desired)
    if (autoHide) {
      setTimeout(() => this.remove(newNotification.id), autoHide);
    }
  }

  // Remove a notification by id.
  remove(id: string): void {
    const notifications = this.notificationsSubject.value.filter(n => n.id !== id);
    this.notificationsSubject.next(notifications);
  }

}
