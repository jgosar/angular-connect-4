import { Injectable } from "@angular/core";
import { Reducer } from "src/app/reducer-store/reducer";
import { CheckersStoreState } from "../checkers.store.state";
import { CheckersMove } from "../types/checkers-move";
import { canPlayMove } from "../utils/checkers-utils";

@Injectable()
export class CheckersPlayMoveReducer implements Reducer<CheckersStoreState, CheckersMove>{
  reduce(state: CheckersStoreState, params: CheckersMove): CheckersStoreState {
    if (state.winner || !canPlayMove(state.field, params)) {
      return {...state};
    }
  }
}
