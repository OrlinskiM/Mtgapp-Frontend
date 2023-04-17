import { User } from "./user";

export class PlayerParticipation{
  public id: number;
  public player: User = new User;
  public score: number;
  public finalPlacement: number;
  public matchesWon: number;
  public matchesLost: number;
  public matchesTied: number;
  public gamesWon: number;
  public gamesLost: number;
  public byeRound: number;
  public omw: number;
  public gw: number;
  public ogw: number;

  constructor(){
    this.matchesWon = 0;
    this.matchesLost = 0;
    this.matchesTied = 0;
    this.gamesLost = 0;
    this.gamesWon = 0;
    this.finalPlacement = 0;
  }
}

