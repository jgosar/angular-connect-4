import { Injectable } from "@angular/core";
import { createArray } from "src/app/helpers/array.helpers";
import { Reducer } from "src/app/reducer-store/reducer";
import { CheckersStoreState } from "../checkers.store.state";
import { CheckersGameParams } from "../types/checkers-game-params";

@Injectable()
export class CheckersInitGameReducer implements Reducer<CheckersStoreState, CheckersGameParams>{
  reduce(state: CheckersStoreState, params: CheckersGameParams): CheckersStoreState {
    return {
      field: createArray(params.rows, createArray(params.columns, 0)),
      nextPlayer: params.firstToken,
      winner: undefined,
      humanPlayers: params.humanPlayers
    };
  }
}
