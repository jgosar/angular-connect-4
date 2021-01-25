import { Injectable } from "@angular/core";
import { createArray } from "src/app/helpers/array.helpers";
import { Reducer } from "src/app/reducer-store/reducer";
import { CheckersStoreState } from "../checkers.store.state";
import { CheckersCellState } from "../types/checkers-cell-state";
import { CheckersGameParams } from "../types/checkers-game-params";
import { CheckersPlayerType } from "../types/checkers-player-type";
import { getDefaultTokenForPlayer, getOtherPlayer } from "../utils/checkers-utils";

@Injectable()
export class CheckersInitGameReducer implements Reducer<CheckersStoreState, CheckersGameParams>{
  reduce(state: CheckersStoreState, params: CheckersGameParams): CheckersStoreState {
    const field: CheckersCellState[][] = createArray(params.rows, createArray(params.columns, 0));
    const bottomPlayer: CheckersPlayerType = [...(params.humanPlayers||[]), CheckersPlayerType.BLACK][0];
    const topPlayer: CheckersPlayerType = getOtherPlayer(bottomPlayer);
    for(let row=0;row<params.filledRows;row++){
      for(let column=0;column<params.columns;column++){
        if((row+column)%2===1){
          field[row][column]=getDefaultTokenForPlayer(topPlayer);
        }
        const rowFromBottom: number = params.rows-row-1;
        if((rowFromBottom+column)%2===1){
          field[rowFromBottom][column]=getDefaultTokenForPlayer(bottomPlayer);
        }
      }
    }

    return {
      field,
      bottomPlayer,
      nextPlayer: params.firstToken,
      winner: undefined,
      humanPlayers: params.humanPlayers
    };
  }
}
