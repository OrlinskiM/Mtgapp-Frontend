import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NotificationType } from '../enum/notification-type.enum';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private notifier: NotifierService) { }

  public sendNotification(notyficationType: NotificationType, message: string){
    if(message){
      this.notifier.notify(notyficationType, message);
    } else {
      this.notifier.notify(notyficationType, 'Error, please try again');
    }
  }
}
