import { CheckersMoveDirection } from "./checkers-move-direction";

export interface CheckersMove{
  column: number;
  row: number;
  direction: CheckersMoveDirection;
}
