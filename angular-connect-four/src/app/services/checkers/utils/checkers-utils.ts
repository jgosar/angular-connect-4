import { CheckersCellState } from "../types/checkers-cell-state";
import { CheckersMove } from "../types/checkers-move";
import { CheckersPlayerType } from "../types/checkers-player-type";
import { CheckersTokenType } from "../types/checkers-token-type";

export function canPlayMove(field: CheckersCellState[][], move: CheckersMove): boolean {
  return false;
}

export function getOtherPlayer(player: CheckersPlayerType): CheckersPlayerType{
  return (player===CheckersPlayerType.WHITE)?CheckersPlayerType.BLACK:CheckersPlayerType.WHITE;
}

export function getPlayerForToken(token: CheckersTokenType): CheckersPlayerType{
  return ([CheckersTokenType.BLACK, CheckersTokenType.BLACK_KING].includes(token))?CheckersPlayerType.BLACK:CheckersPlayerType.WHITE;
}

export function getDefaultTokenForPlayer(player: CheckersPlayerType): CheckersTokenType{
  return (player===CheckersPlayerType.WHITE)?CheckersTokenType.WHITE:CheckersTokenType.BLACK;
}