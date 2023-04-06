import { User } from "./user";

export class Game{
  public gameid: number;
  public round: number;
  public scorePlayer1: number;
  public scorePlayer2: number;
  public gameResult: string;
  public player1: User;
  public player2: User;
}
