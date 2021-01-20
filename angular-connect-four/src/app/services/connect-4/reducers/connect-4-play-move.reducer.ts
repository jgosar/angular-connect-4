import { Injectable } from "@angular/core";
import { canPlayMove, getLowestFreeCell, getOtherTokenType, getWinner } from "src/app/services/connect-4/utils/connect-4-utils";
import { cloneArray, getColumnValues } from "src/app/helpers/array.helpers";
import { CellState } from "src/app/types/cell-state";
import { Connect4TokenType } from "src/app/services/connect-4/types/connect-4-token-type";
import { Connect4StoreState } from "../connect-4.store.state";
import { Reducer } from "../../../reducer-store/reducer";
import { Connect4Move } from "../types/connect-4-move";

@Injectable()
export class Connect4PlayMoveReducer implements Reducer<Connect4StoreState, Connect4Move>{
  reduce(state: Connect4StoreState, params: Connect4Move): Connect4StoreState {
    if (state.winner || !canPlayMove(state.field, params)) {
      return {...state};
    }

    const columnIndex: number = params.column;

    const currentToken: Connect4TokenType = state.nextPlayer;
    const otherToken: Connect4TokenType = getOtherTokenType(currentToken);
    const rowIndex: number = getLowestFreeCell(getColumnValues(params.column, state.field));
    const newField: CellState[][] = cloneArray(state.field);
    newField[rowIndex][params.column] = currentToken;

    // Remove all the combos that the opponent can't use because we have blocked them
    const newOpponentCellCombos = state.availableCellCombos[otherToken].filter(
      (cellCombo) => !cellCombo.some((cell) => cell.row === rowIndex && cell.column === columnIndex)
    );

    let newState: Connect4StoreState = {
      ...state,
      field: newField,
      availableCellCombos: {
        ...state.availableCellCombos,
        [otherToken]: newOpponentCellCombos,
      },
      nextPlayer: otherToken,
    };

    newState = {
      ...newState,
      winner: getWinner(newState),
    };
    return newState;
  }
}