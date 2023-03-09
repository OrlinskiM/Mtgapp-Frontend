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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{
  private subscriptions: Subscription[] = [];

  constructor(private router: Router, private authenticationService: AuthenticationService, private notifier: NotificationService){}

  ngOnInit(): void {
    if(this.authenticationService.isLoggedIn()){
      this.router.navigateByUrl('/user/management');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  public onLogin(user: User): void{
    console.log(user);
    this.subscriptions.push(
      this.authenticationService.login(user).subscribe(
        (response: HttpResponse<User> | HttpErrorResponse) => {
          if(response.ok){
            const token = response.headers.get(HeaderType.JWT_TOKEN);
          this.authenticationService.saveToken(token);
          this.authenticationService.addUserToLocalCache(response.body)
          this.router.navigateByUrl('/user/management');
          }
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          this.sendErrorNotification(NotificationType.ERROR, error.error.message);
        }
      )
    );
  }
  private sendErrorNotification(notyficationType: NotificationType, message: string) {
    if(message){
      this.notifier.notify(notyficationType, message);
    } else {
      this.notifier.notify(notyficationType, 'Error, please try again');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
