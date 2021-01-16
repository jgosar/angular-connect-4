import { Injectable } from "@angular/core";
import { getCellCombos } from "src/app/core/combo-calculator";
import { createArray } from "src/app/helpers/array.helpers";
import { CellCoords } from "src/app/types/cell-coords";
import { TokenType } from "src/app/types/token-type";
import { Connect4StoreState } from "../connect-4.store.state";
import { InitGameReducerParams } from "./init-game-reducer.params";
import { Reducer } from "./reducer";

@Injectable()
export class InitGameReducer implements Reducer<Connect4StoreState, InitGameReducerParams>{
  reduce(state: Connect4StoreState, params: InitGameReducerParams): Connect4StoreState {
    const cellCombos: CellCoords[][] = getCellCombos(params.rows, params.columns, params.connectHowMany);
    return {
      field: createArray(params.rows, createArray(params.columns, 0)),
      availableCellCombos: {
        [TokenType.RED]: cellCombos,
        [TokenType.YELLOW]: cellCombos,
      },
      nextToken: params.firstToken,
      winner: undefined,
    };
  }
}
