import { Game } from "./game";
import { PlayerParticipation } from "./player-participation";
import { RoundMatching } from "./round-matching";
import { User } from "./user";

export class Tournament{
	tournamentString: string;
	rounds: number;
	currentRound: number;
	creationDate?: any;
	finishDate?: any;
	owner: User;
	participations: PlayerParticipation[];
	allGames: Game[];
	roundMatchings: RoundMatching[];
	finished: boolean;
}
