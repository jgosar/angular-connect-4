import { GameStoreState } from "src/app/generics/game-store.state";
import { CheckersCellState } from "./types/checkers-cell-state";
import { CheckersPlayerType } from "./types/checkers-player-type";

export class CheckersStoreState extends GameStoreState<CheckersPlayerType> {
  field: CheckersCellState[][];
  bottomPlayer: CheckersPlayerType;
}
