import { CellState } from "src/app/types/cell-state";
import { CheckersTokenType } from "./types/checkers-token-type";

export class CheckersStoreState {
  field: CellState[][];
  nextPlayer: CheckersTokenType;
  winner: CheckersTokenType | undefined;
  humanPlayers: CheckersTokenType[];
}
