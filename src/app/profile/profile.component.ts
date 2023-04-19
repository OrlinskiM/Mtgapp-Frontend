import { Component } from '@angular/core';
import { NotificationService } from '../service/notification.service';
import { UserService } from '../service/user.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../model/user';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationType } from '../enum/notification-type.enum';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  private subscriptions: Subscription[] = [];
  private username: string;
  user: User;
  currentUser: User;
  public editUser: User = new User;
  profileImage: File;
  fileName: any;
  currentUsername: string;

  constructor(private userService: UserService,
     private notifier: NotificationService,
     private route: ActivatedRoute,){}


  ngOnInit() {
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        this.username = params['username'];
      })
    );
    this.getUser(false);
    this.currentUser = this.userService.getLoggedInUserFromLocalCache();
  }

  getUser(showNotification: boolean) {
    this.subscriptions.push(
      this.userService.getUser(this.username).subscribe(
        (response: User) => {
          this.user = response;
          if (showNotification) {
            this.notifier.sendNotification(NotificationType.SUCCESS, `User loaded successfully.`);
          }
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
          this.notifier.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
    }

    onEditUser(editUser: User): void {
      this.editUser = editUser;
      this.currentUsername = editUser.username;
      document.getElementById('openUserEdit').click();
    }

    onProfileImageChange(event: any): void {
      console.log(event);
      this.profileImage = (event.target as HTMLInputElement).files[0];
      this.fileName = (event.target as HTMLInputElement).files[0].name;
    }

    onUpdateUser(): void {
      const formData = this.userService.createUserFormData(this.currentUsername, this.editUser, this.profileImage);
      this.subscriptions.push(
        this.userService.updateUser(formData).subscribe(
          (response: User) => {
            document.getElementById('closeEditUserModalButton').click();
            this.getUser(false);
            this.notifier.sendNotification(NotificationType.SUCCESS, `${response.username} updated succesfully`);
          },
          (errorResponse: HttpErrorResponse) => {
            console.log(errorResponse);
            this.notifier.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          }
        )
      );
      }
}
