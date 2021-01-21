import { Connect4StoreState } from "../connect-4.store.state";
import { CellCoords } from "../../../types/cell-coords";
import { Connect4CellState } from "../types/connect-4-cell-state";
import { Connect4TokenType } from "../types/connect-4-token-type";
import { Connect4Move } from "../types/connect-4-move";

export function getOtherTokenType(tokenType: Connect4TokenType): Connect4TokenType {
  return tokenType === Connect4TokenType.RED ? Connect4TokenType.YELLOW : Connect4TokenType.RED;
}

export function canPlayMove(field: Connect4CellState[][], move: Connect4Move): boolean {
  return field[0][move.column] === 0;
}

export function getWinner(state: Connect4StoreState): Connect4TokenType | undefined {
  return state.availableCellCombos[Connect4TokenType.RED]
    .concat(state.availableCellCombos[Connect4TokenType.YELLOW])
    .map((cellCombo) => getWinnerForCombo(state.field, cellCombo))
    .find((winner) => winner !== undefined);
}

export function getLowestFreeCell(columnValues: Connect4CellState[]): number | undefined {
  const firstFilledCell: number = columnValues.findIndex(cellValue=>cellValue!==0);
  switch(firstFilledCell){
    case 0: return undefined;
    case -1: return columnValues.length - 1;
    default: return firstFilledCell - 1;
  }
}

function getWinnerForCombo(field: Connect4CellState[][], cellCombo: CellCoords[]): Connect4TokenType | undefined {
  const cellStatesInCombo: Connect4CellState[] = cellCombo.map((cellCoords) => field[cellCoords.row][cellCoords.column]);
  if (cellStatesInCombo.every((cellState) => cellState === Connect4TokenType.RED)) {
    return Connect4TokenType.RED;
  } else if (cellStatesInCombo.every((cellState) => cellState === Connect4TokenType.YELLOW)) {
    return Connect4TokenType.YELLOW;
  }
}
