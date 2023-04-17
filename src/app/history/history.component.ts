import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Tournament } from '../model/tournament';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '../service/tournament.service';
import { NotificationService } from '../service/notification.service';
import { NotificationType } from '../enum/notification-type.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../model/user';
import { PlayerParticipation } from '../model/player-participation';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent {
  private subscriptions: Subscription[] = [];
  tournaments: Tournament[];
  currentUser: User;
  currentParticipation: PlayerParticipation;
  averageParticipation: PlayerParticipation = new PlayerParticipation();

  constructor(private router: Router,
              private notifier: NotificationService,
              private tournamentService: TournamentService){}

  ngOnInit() {
    this.getTournaments(false);
    this.currentUser = this.getLoggedInUserFromLocalCache();
  }

  getTournaments(showNotification: boolean) {
    this.subscriptions.push(
      this.tournamentService.getTournaments().subscribe(
        (response: Tournament[]) => {
          this.tournaments = response;
          this.calculateAverageParticipation();
          if (showNotification) {
            this.notifier.sendNotification(NotificationType.SUCCESS, `Tournaments loaded successfully.`);
          }
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
          this.notifier.sendNotification(NotificationType.ERROR, errorResponse.error.message);

        }
      )
    );
    }

    onSelectTournament(tournament: Tournament){
      this.router.navigateByUrl(`/tournament/${tournament.tournamentString}`)
    }

    findParticipationInTournament(tournament: Tournament){
      tournament.participations.forEach(participation => {
        if(participation.player.userId == this.currentUser.userId){
          this.currentParticipation = participation;
          return participation;
        }
      });
      return this.currentParticipation;
    }

    calculateAverageParticipation(){
      var tempParticipations: PlayerParticipation[] = [];
      this.tournaments.forEach(tournament => {
        tempParticipations.push(this.findParticipationInTournament(tournament));
      });

      tempParticipations.forEach(participation => {
        if(participation.finalPlacement == 1){
          this.averageParticipation.finalPlacement += 1;
        }
        this.averageParticipation.matchesWon += participation.matchesWon;
        this.averageParticipation.matchesLost += participation.matchesLost;
        this.averageParticipation.matchesTied += participation.matchesTied;
        this.averageParticipation.gamesWon += participation.gamesWon;
        this.averageParticipation.gamesLost += participation.gamesLost;
      })
    }

    private getLoggedInUserFromLocalCache(): User{
      if(localStorage.getItem('user')){
        return JSON.parse(localStorage.getItem('user') || '{}');
      }
      return null;
    }
}
