import { TokenType } from "./token-type";

export interface GameParams {
  rows: number;
  columns: number;
  connectHowMany: number;
  firstToken: TokenType;
  humanPlayers: TokenType[];
}
