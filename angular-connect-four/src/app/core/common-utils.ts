import { Connect4StoreState } from "../services/connect-4/connect-4.store.state";
import { CellCoords } from "../types/cell-coords";
import { CellState } from "../types/cell-state";
import { TokenType } from "../types/token-type";

export function getOtherTokenType(tokenType: TokenType): TokenType {
  return tokenType === TokenType.RED ? TokenType.YELLOW : TokenType.RED;
}

export function canDropToken(field: CellState[][], columnIndex: number): boolean {
  return field[0][columnIndex] === 0;
}

export function getWinner(state: Connect4StoreState): TokenType | undefined {
  return state.availableCellCombos[TokenType.RED]
    .concat(state.availableCellCombos[TokenType.YELLOW])
    .map((cellCombo) => getWinnerForCombo(state.field, cellCombo))
    .find((winner) => winner !== undefined);
}

export function getLowestFreeCell(columnValues: CellState[]): number | undefined {
  const firstFilledCell: number = columnValues.findIndex(cellValue=>cellValue!==0);
  switch(firstFilledCell){
    case 0: return undefined;
    case -1: return columnValues.length - 1;
    default: return firstFilledCell - 1;
  }
}

function getWinnerForCombo(field: CellState[][], cellCombo: CellCoords[]): TokenType | undefined {
  const cellStatesInCombo: CellState[] = cellCombo.map((cellCoords) => field[cellCoords.row][cellCoords.column]);
  if (cellStatesInCombo.every((cellState) => cellState === TokenType.RED)) {
    return TokenType.RED;
  } else if (cellStatesInCombo.every((cellState) => cellState === TokenType.YELLOW)) {
    return TokenType.YELLOW;
  }
}
