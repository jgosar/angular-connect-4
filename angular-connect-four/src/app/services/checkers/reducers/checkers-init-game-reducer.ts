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
    for(let i=0;i<params.filledRows;i++){
      for(let j=0;j<params.columns;j++){
        if((i+j)%2===1){
          field[i][j]=getDefaultTokenForPlayer(topPlayer);
        }
        const i2: number = params.rows-i-1;
        if((i2+j)%2===1){
          field[i2][j]=getDefaultTokenForPlayer(bottomPlayer);
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
