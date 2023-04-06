import { User } from "./user";

export class PlayerParticipation{
  public id: number;
  public player: User;
  public score: number;
  public roundsWon: number;
  public gamesWon: number;
  public byeRound: number;
}
