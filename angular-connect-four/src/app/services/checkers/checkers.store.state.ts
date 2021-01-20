import { GameStoreState } from "src/app/generics/game-store.state";
import { CellState } from "src/app/types/cell-state";
import { CheckersPlayerType } from "./types/checkers-player-type";

export class CheckersStoreState extends GameStoreState<CheckersPlayerType> {
  field: CellState[][];
}
