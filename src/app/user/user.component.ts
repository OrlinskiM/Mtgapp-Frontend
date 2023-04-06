import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { CustomHttpResponse } from '../model/custom-http-response';
import { User } from '../model/user';
import { NotificationService } from '../service/notification.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy{

  refreshing: boolean;
  users: User[];
  public isAdmin: Boolean;
  fileName: any;
  private titleSubject = new BehaviorSubject<string>('Users');
  public titleAction$ = this.titleSubject.asObservable();
  private subscriptions: Subscription[] = [];
  public selectedUser: User;
  public editUser: User = new User;
  profileImage: File;
  private currentUsername: string;

  constructor(private userService: UserService, private notifier: NotificationService) {}
  ngOnInit(): void {
    this.getUsers(true);
    this.isAdmin = true;
  }

  public changeTitle(title: string): void{
    this.titleSubject.next(title);
  }

  searchUsers(searchTerm: string): void {
      const result: User[] = [];
      for(const user of this.userService.getUsersFromLocalCache()){
        if(user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1){
          result.push(user);
        }
      }
      this.users = result;

      if (result.length == 0 || !searchTerm){
        this.users = this.userService.getUsersFromLocalCache();
      }
    }

  getUsers(showNotification: boolean) {
    this.refreshing = true;
    this.subscriptions.push(
      this.userService.getUsers().subscribe(
        (response: User[]) => {
          this.userService.addUsersToLocalCache(response);
          this.users = response;
          this.refreshing = false;
          if (showNotification) {
            this.notifier.sendNotification(NotificationType.SUCCESS, `${response.length} user(s) loaded successfully.`);
          }
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
          this.notifier.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing = false;
        }
      )
    );
    }
  onDeleteUser(username: string): void {
      this.subscriptions.push(
        this.userService.deleteUser(username).subscribe(
          (response: CustomHttpResponse) => {
            this.notifier.sendNotification(NotificationType.SUCCESS, `${response.message}`);
            this.getUsers(false);
          },
          (errorResponse: HttpErrorResponse) => {
            console.log(errorResponse);
            this.notifier.sendNotification(NotificationType.ERROR, errorResponse.error.message);
            this.refreshing = false;
          }
        )
      )
    }
  onEditUser(editUser: User): void {
      this.editUser = editUser;
      this.currentUsername = editUser.username;
      document.getElementById('openUserEdit').click();
    }
  onAddNewUser(userform: NgForm): void {
      const formData = this.userService.createUserFormData(null, userform.value, this.profileImage);
      this.subscriptions.push(
        this.userService.addUser(formData).subscribe(
          (response: User) => {
            document.getElementById('new-user-close').click();
            this.getUsers(false);
            userform.reset();
            this.notifier.sendNotification(NotificationType.SUCCESS, `${response.username} added succesfully`);
          },
          (errorResponse: HttpErrorResponse) => {
            console.log(errorResponse);
            this.notifier.sendNotification(NotificationType.ERROR, errorResponse.error.message);
            this.refreshing = false;
          }
        )
      );

    }

    onUpdateUser(): void {
      const formData = this.userService.createUserFormData(this.currentUsername, this.editUser, this.profileImage);
      this.subscriptions.push(
        this.userService.updateUser(formData).subscribe(
          (response: User) => {
            document.getElementById('closeEditUserModalButton').click();
            this.getUsers(false);
            this.notifier.sendNotification(NotificationType.SUCCESS, `${response.username} updated succesfully`);
          },
          (errorResponse: HttpErrorResponse) => {
            console.log(errorResponse);
            this.notifier.sendNotification(NotificationType.ERROR, errorResponse.error.message);
            this.refreshing = false;
          }
        )
      );
      }
  onProfileImageChange(event: any): void {
      console.log(event);
      this.profileImage = (event.target as HTMLInputElement).files[0];
      this.fileName = (event.target as HTMLInputElement).files[0].name;
    }

  onResetPassword(email: string): void{
    this.subscriptions.push(
      this.userService.resetPassword(email).subscribe(
        (response: CustomHttpResponse) => {
          this.notifier.sendNotification(NotificationType.SUCCESS, `${response.message}`);
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
          this.notifier.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing = false;
        }
      )
    );
    }

  saveNewUser() {
    document.getElementById('new-user-save').click();
    }
  onSelectUser(selectedUser: User): void{
      this.selectedUser = selectedUser;
      document.getElementById('openUserInfo').click();
    }

    ngOnDestroy(): void {
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
