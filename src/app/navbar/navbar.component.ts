import { Component } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Tournament } from '../model/tournament';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../service/notification.service';
import { NotificationType } from '../enum/notification-type.enum';
import { TournamentService } from '../service/tournament.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  private subscriptions: Subscription[] = [];

  constructor(private authenticationService: AuthenticationService,
                      private notifier: NotificationService,
                      private tournamentService: TournamentService,
                      private router: Router){

  }

  home() {
    this.router.navigateByUrl(`home`);
    }

  addNewTournament(){
    this.subscriptions.push(
      this.tournamentService.addTournament().subscribe(
        (response: Tournament) => {
          console.log(response.tournamentString);
          this.tournamentService.deleteTournamentFromLocalCache(response);
          this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        }
        this.router.onSameUrlNavigation = 'reload';
          this.router.navigateByUrl(`/tournament/${response.tournamentString}`);
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
          this.notifier.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }

  tournamentHistory(){
    this.router.navigateByUrl(`/user/tournaments`);
  }

  logout(){
    this.authenticationService.logout();
    this.router.navigateByUrl(`/login`);
  }
}
