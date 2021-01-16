import { GameParams } from "./game-params";

export interface EncodedGameState{
  gameParams: GameParams;
  columnStates: number[];
}
