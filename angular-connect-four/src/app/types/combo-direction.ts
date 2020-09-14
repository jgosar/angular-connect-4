import { CellCoords } from './cell-coords';

export enum ComboDirection {
  HORIZONTAL,
  DIAGONAL_1, // Towards the right and downwards
  VERTICAL,
  DIAGONAL_2, // Towards the left and downwards
}

export function getComboDirectionNthCell(direction: ComboDirection, startCell: CellCoords, n: number): CellCoords {
  switch (direction) {
    case ComboDirection.HORIZONTAL:
      return { row: startCell.row, column: startCell.column + n };
    case ComboDirection.DIAGONAL_1:
      return { row: startCell.row + n, column: startCell.column + n };
    case ComboDirection.VERTICAL:
      return { row: startCell.row + n, column: startCell.column };
    case ComboDirection.DIAGONAL_2:
      return { row: startCell.row + n, column: startCell.column - n };
  }
}
