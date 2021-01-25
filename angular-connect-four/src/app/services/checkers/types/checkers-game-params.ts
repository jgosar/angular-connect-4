import { CheckersPlayerType } from "./checkers-player-type";

export interface CheckersGameParams {
  rows: number;
  columns: number;
  filledRows: number;
  firstToken: CheckersPlayerType;
  humanPlayers: CheckersPlayerType[];
}
