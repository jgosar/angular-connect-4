import { Connect4TokenType as Connect4TokenType } from "./connect-4-token-type";

export interface Connect4GameParams {
  rows: number;
  columns: number;
  connectHowMany: number;
  firstToken: Connect4TokenType;
  humanPlayers: Connect4TokenType[];
}
