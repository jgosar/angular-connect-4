import { range } from "../../../helpers/common.helpers";
import { CellCoords } from "../../../types/cell-coords";
import { ComboDirection, getComboDirectionNthCell } from "../../../types/combo-direction";

export function getCellCombos(rowCount: number, columnCount: number, connectHowMany: number): CellCoords[][] {
  const allDirections: ComboDirection[] = [
    ComboDirection.HORIZONTAL,
    ComboDirection.DIAGONAL_1,
    ComboDirection.VERTICAL,
    ComboDirection.DIAGONAL_2,
  ];

  return allDirections.reduce<CellCoords[][]>(
    (combos, direction) => combos.concat(getCellCombosForDirection(rowCount, columnCount, connectHowMany, direction)),
    []
  );
}

function getCellCombosForDirection(rowCount: number, columnCount: number, connectHowMany: number, direction: ComboDirection): CellCoords[][] {
  let startCells: CellCoords[];

  if (direction !== ComboDirection.DIAGONAL_2) {
    // This is the last cell, from which a combo in this direction can start
    const finalStartCellCoords: CellCoords = getComboDirectionNthCell(
      direction,
      { row: rowCount - 1, column: columnCount - 1 },
      1 - connectHowMany
    );

    // Get a list of all coordinates from which such a combination can start
    startCells = getCellCoordsInArea(0, finalStartCellCoords.row + 1, 0, finalStartCellCoords.column + 1);
  } else if (direction === ComboDirection.DIAGONAL_2) {
    // This direction is the exception, because it can't start at coordinates (0, 0)
    startCells = getCellCoordsInArea(
      0,
      rowCount - (connectHowMany - 1),
      connectHowMany - 1,
      columnCount
    );
  }

  return startCells.map((startCell) => extendCombo(direction, connectHowMany, startCell));
}

function extendCombo(direction: ComboDirection, length: number, startCell: CellCoords): CellCoords[] {
  return range(0, length).map((i) => getComboDirectionNthCell(direction, startCell, i));
}

function getCellCoordsInArea(startRow: number, endRow: number, startColumn: number, endColumn: number): CellCoords[] {
  const result: CellCoords[] = [];
  range(startRow, endRow).forEach((row) =>
    range(startColumn, endColumn).forEach((column) => result.push({ row, column }))
  );
  return result;
}