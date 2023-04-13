import { Match } from "./match";
import { PlayerParticipation } from "./player-participation";
import { RoundMatching } from "./round-matching";
import { User } from "./user";

export class Tournament{
	tournamentString: string;
	rounds: number;
	currentRound: number;
	creationDate?: any;
	finishDate?: any;
	owner: User = new User;
	participations: PlayerParticipation[];
	allMatchs: Match[];
	roundMatchings: RoundMatching[];
	finished: boolean;

}
