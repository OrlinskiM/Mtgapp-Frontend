import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tournament } from '../model/tournament';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  private host = 'http://localhost:8081';
  constructor(private http: HttpClient) { }

  public getTournament(tournamentString: string): Observable<Tournament>{
    return this.http.get<Tournament>(`${this.host}/tournament/${tournamentString}`);
  }

  public addTournament(): Observable<Tournament>{
    return this.http.get<Tournament>(`${this.host}/tournament/add`);
  }

  public startTournament(tournamentString: string, formData: FormData): Observable<Tournament>{
    return this.http.post<Tournament>(`${this.host}/tournament/${tournamentString}/start`, formData);
  }

  public pairTournamentRound(tournamentString: string): Observable<Tournament>{
    return this.http.get<Tournament>(`${this.host}/tournament/${tournamentString}/nextRound`);
  }

  public addGuestToTournament(tournamentString: string, formData: FormData): Observable<Tournament>{
    return this.http.post<Tournament>(`${this.host}/tournament/${tournamentString}/guest`, formData);
  }

  public addResultsToMatch(tournamentString: string, formData: FormData): Observable<Tournament>{
    return this.http.post<Tournament>(`${this.host}/tournament/${tournamentString}/matchResults`, formData);
  }


  public addTournamentToLocalCache(tournament: Tournament): void{
    localStorage.setItem('tournament', JSON.stringify(tournament));
  }

  public deleteTournamentFromLocalCache(tournament: Tournament): void{
    localStorage.removeItem('tournament');
  }

  public getTournamentFromLocalCache(): Tournament{
    if(localStorage.getItem('tournament')){
      return JSON.parse(localStorage.getItem('tournament') || '{}');
    }
    return null;
  }
}
