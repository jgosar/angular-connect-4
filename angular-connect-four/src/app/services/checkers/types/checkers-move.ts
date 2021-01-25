import { CheckersMoveDirection } from "./checkers-move-direction";
import { CheckersMoveType } from "./checkers-move-type";

export interface CheckersMove{
  row: number;
  column: number;
  direction: CheckersMoveDirection;
  type: CheckersMoveType;
}
