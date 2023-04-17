import { PlayerParticipation } from "./player-participation";
import { User } from "./user";

export class Match{
  public matchId: number;
  public round: number;
  public gamesWonPlayer1: number;
  public gamesWonPlayer2: number;
  public matchResult: string;
  public player1: PlayerParticipation = new PlayerParticipation();
  public player2: PlayerParticipation = new PlayerParticipation();

  constructor(){
    this.matchId = 0;
    this.round = 0;
    this.gamesWonPlayer1 = 0;
    this.gamesWonPlayer2 = 0;
    this.matchResult = '';
    this.player1.player = new User();
    this.player1.byeRound = 0;
    this.player1.gamesWon = 0;
    this.player1.id = 0;
    this.player1.matchesWon = 0;
    this.player1.score = 0;
    this.player2.player = new User();
    this.player2.byeRound = 0;
    this.player2.gamesWon = 0;
    this.player2.id = 0;
    this.player2.matchesWon = 0;
    this.player2.score = 0;
  }
}




