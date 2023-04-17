import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from '../service/notification.service';
import { TournamentService } from '../service/tournament.service';
import { Tournament } from '../model/tournament';
import { NotificationType } from '../enum/notification-type.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { PlayerParticipation } from '../model/player-participation';
import { NgForm } from '@angular/forms';
import { Match } from '../model/match';
import { User } from '../model/user';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.css']
})
export class TournamentComponent {
onSelectParticipation(_t32: PlayerParticipation) {
throw new Error('Method not implemented.');
}

  private subscriptions: Subscription[] = [];
  tournamentString: string;
  tournament: Tournament;
  currentUser: User;
  currentMatch: Match = new Match;
  isOwner: boolean;

  constructor(private route: ActivatedRoute,
              private notifier: NotificationService,
              private tournamentService: TournamentService) {}

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        this.tournamentString = params['tournamentString'];
      })
    );
    this.getTournament(true);
  }

  getTournament(showNotification: boolean) {
    this.subscriptions.push(
      this.tournamentService.getTournament(this.tournamentString).subscribe(
        (response: Tournament) => {
          this.tournamentService.addTournamentToLocalCache(response);
          this.tournament = response;
          this.isUserOwner();
          this.sortParticipations();
          if (showNotification) {
            this.notifier.sendNotification(NotificationType.SUCCESS, `${response.tournamentString} loaded successfully.`);
          }
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
          this.notifier.sendNotification(NotificationType.ERROR, errorResponse.error.message);

        }
      )
    );
    }

  sortParticipations() {
    if(!this.tournament.finished){
      this.tournament.participations.sort((a,b) => (a.score > b.score) ? -1 : 1);
    } else {
      this.tournament.participations.sort((a,b) => (a.finalPlacement > b.finalPlacement) ? 1 : -1);
    }
  }

  isUserOwner() {
    this.currentUser = this.getLoggedInUserFromLocalCache();
    if(this.tournament.owner.userId == this.currentUser.userId){
      this.isOwner = true;
    } else {
      this.isOwner = false;
    }
  }

    onGuestSubmit(guestform: NgForm){
      const formData = new FormData();
      formData.append('username', guestform.form.get('username').value)
      this.subscriptions.push(
        this.tournamentService.addGuestToTournament(this.tournamentString, formData).subscribe(
          (response: Tournament) => {
            this.getTournament(false);
            guestform.reset();
            this.notifier.sendNotification(NotificationType.SUCCESS, `Guest added succesfully`);
          },
          (errorResponse: HttpErrorResponse) => {
            console.log(errorResponse);
            this.notifier.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          }
        )
      );
    }

    onMatchResultSubmit(matchform: NgForm){
      const formData = new FormData();
      formData.append('matchId', this.currentMatch.matchId.toString());
      formData.append('gamesWonPlayer1', matchform.form.get('gamesWonPlayer1').value);
      formData.append('gamesWonPlayer2', matchform.form.get('gamesWonPlayer2').value);
      this.subscriptions.push(
        this.tournamentService.addResultsToMatch(this.tournamentString, formData).subscribe(
          (response: Tournament) => {
            this.getTournament(false);
            matchform.reset();
            document.getElementById('match-close').click();
            this.notifier.sendNotification(NotificationType.SUCCESS, `Results set`);
          },
          (errorResponse: HttpErrorResponse) => {
            console.log(errorResponse);
            this.notifier.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          }
        )
      );
    }

    onSelectMatch(match: Match){
      if(this.isOwner && this.tournament.currentRound == match.round){
        this.currentMatch = match;
        document.getElementById('openMatchResults').click();
      }
    }

    onTournamentStart(startForm: NgForm){
      const formData = new FormData();
      formData.append('rounds', startForm.form.get('rounds').value)
      this.subscriptions.push(
        this.tournamentService.startTournament(this.tournamentString, formData).subscribe(
          (response: Tournament) => {
            this.getTournament(false);
            startForm.reset();
            this.notifier.sendNotification(NotificationType.SUCCESS, `Tournament Started`);
          },
          (errorResponse: HttpErrorResponse) => {
            console.log(errorResponse);
            this.notifier.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          }
        )
      );
    }

    onNextRound(){
      this.subscriptions.push(
        this.tournamentService.pairTournamentRound(this.tournamentString).subscribe(
          (response: Tournament) => {
            this.getTournament(false);
            this.notifier.sendNotification(NotificationType.SUCCESS, `Round ${this.tournament.currentRound + 1} paired succesfully`);
          },
          (errorResponse: HttpErrorResponse) => {
            console.log(errorResponse);
            this.notifier.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          }
        )
      );
    }

    saveMatch(){
      document.getElementById('match-save').click();
    }

    private getLoggedInUserFromLocalCache(): User{
      if(localStorage.getItem('user')){
        return JSON.parse(localStorage.getItem('user') || '{}');
      }
      return null;
    }


}
