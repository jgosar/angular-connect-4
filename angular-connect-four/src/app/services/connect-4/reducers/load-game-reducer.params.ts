import { InitGameReducerParams } from "./init-game-reducer.params";

export interface LoadGameReducerParams{
  gameParams: InitGameReducerParams;
  columnStates: number[];
}
