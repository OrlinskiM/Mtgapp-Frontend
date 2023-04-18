import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../service/notification.service';
import { TournamentService } from '../service/tournament.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationType } from '../enum/notification-type.enum';
import { Tournament } from '../model/tournament';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  private subscriptions: Subscription[] = [];

  constructor(private router: Router,
    private notifier: NotificationService,
    private tournamentService: TournamentService){}


    join(tournamentString: string) {
      this.subscriptions.push(
        this.tournamentService.getTournament(tournamentString).subscribe(
          (response: Tournament) => {
            this.notifier.sendNotification(NotificationType.SUCCESS, `${response.tournamentString} loaded successfully.`);
            this.router.navigateByUrl(`/tournament/${tournamentString}`)
          },
          (errorResponse: HttpErrorResponse) => {
            console.log(errorResponse);
            this.notifier.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }
        )
      );
      }
}
