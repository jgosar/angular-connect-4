import { CheckersTokenType as CheckersTokenType } from "./checkers-token-type";

export interface CheckersGameParams {
  rows: number;
  columns: number;
  filledRows: number;
  firstToken: CheckersTokenType;
  humanPlayers: CheckersTokenType[];
}
