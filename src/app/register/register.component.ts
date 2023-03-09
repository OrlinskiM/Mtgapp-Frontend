import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HeaderType } from '../enum/header-type.enum';
import { NotificationType } from '../enum/notification-type.enum';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy{
  private subscriptions: Subscription[] = [];

  constructor(private router: Router, private authenticationService: AuthenticationService, private notifier: NotificationService){}

  ngOnInit(): void {
    if(this.authenticationService.isLoggedIn()){
      this.router.navigateByUrl('/user/management');
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public onRegister(user: User): void{
    console.log(user);
    this.subscriptions.push(
      this.authenticationService.register(user).subscribe(
        (response: User) => {
          this.sendNotification(NotificationType.SUCCESS, `New account created: ${response.firstName}.`);
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    );
  }
  private sendNotification(notyficationType: NotificationType, message: string) {
    if(message){
      this.notifier.notify(notyficationType, message);
    } else {
      this.notifier.notify(notyficationType, 'Error, please try again');
    }
  }

}
