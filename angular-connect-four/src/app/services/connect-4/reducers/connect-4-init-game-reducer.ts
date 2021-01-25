import { Injectable } from "@angular/core";
import { getCellCombos } from "src/app/services/connect-4/utils/combo-calculator";
import { createArray } from "src/app/helpers/array.helpers";
import { CellCoords } from "src/app/types/cell-coords";
import { Connect4TokenType } from "src/app/services/connect-4/types/connect-4-token-type";
import { Connect4StoreState } from "../connect-4.store.state";
import { Reducer } from "../../../reducer-store/reducer";
import { Connect4GameParams } from "src/app/services/connect-4/types/connect-4-game-params";

@Injectable()
export class Connect4InitGameReducer implements Reducer<Connect4StoreState, Connect4GameParams>{
  reduce(state: Connect4StoreState, params: Connect4GameParams): Connect4StoreState {
    const cellCombos: CellCoords[][] = getCellCombos(params.rows, params.columns, params.connectHowMany);
    return {
      field: createArray(params.rows, createArray(params.columns, 0)),
      availableCellCombos: {
        [Connect4TokenType.RED]: cellCombos,
        [Connect4TokenType.YELLOW]: cellCombos,
      },
      nextPlayer: params.firstToken,
      winner: undefined,
      humanPlayers: params.humanPlayers
    };
  }
}
