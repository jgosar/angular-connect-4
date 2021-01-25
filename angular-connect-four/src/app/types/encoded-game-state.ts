import { Connect4GameParams } from "../services/connect-4/types/connect-4-game-params";

export interface EncodedGameState{
  gameParams: Connect4GameParams;
  columnStates: number[];
}
