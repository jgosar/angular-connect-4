import { TokenType } from "src/app/types/token-type";

export interface InitGameReducerParams{
  rows: number;
  columns: number;
  connectHowMany: number;
  firstToken: TokenType;
}
