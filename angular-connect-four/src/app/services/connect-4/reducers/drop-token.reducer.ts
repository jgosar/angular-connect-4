import { Injectable } from "@angular/core";
import { canDropToken, getOtherTokenType, getWinner } from "src/app/core/common-utils";
import { cloneArray, getColumnValues } from "src/app/helpers/array.helpers";
import { CellState } from "src/app/types/cell-state";
import { TokenType } from "src/app/types/token-type";
import { Connect4StoreState } from "../connect-4.store.state";
import { DropTokenReducerParams } from "./drop-token-reducer.params";
import { Reducer } from "./reducer";

@Injectable()
export class DropTokenReducer implements Reducer<Connect4StoreState, DropTokenReducerParams>{
  reduce(state: Connect4StoreState, params: DropTokenReducerParams): Connect4StoreState {
    const columnIndex: number = params.columnIndex;

    if (state.winner || !canDropToken(state.field, columnIndex)) {
      return {...state};
    }

    const currentToken: TokenType = state.nextToken;
    const otherToken: TokenType = getOtherTokenType(currentToken);
    const rowIndex: number = this.getLowestFreeCell(getColumnValues(columnIndex, state.field));
    const newField: CellState[][] = cloneArray(state.field);
    newField[rowIndex][columnIndex] = currentToken;

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
      nextToken: otherToken,
    };

    newState = {
      ...newState,
      winner: getWinner(newState),
    };
    return newState;
  }

  private getLowestFreeCell(columnValues: CellState[]): number | undefined {
    for (let i = 0; i < columnValues.length; i++) {
      if (columnValues[i] !== 0) {
        if (i == 0) {
          return undefined;
        } else {
          return i - 1;
        }
      }
    }
    return columnValues.length - 1;
  }
}