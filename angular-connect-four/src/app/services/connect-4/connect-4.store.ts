import { Injectable } from '@angular/core';
import { Connect4StoreState } from './connect-4.store.state';
import { Store } from 'rxjs-observable-store';
import { TokenType } from 'src/app/types/token-type';
import { createArray, getColumnValues, cloneArray } from '../../helpers/array.helpers';
import { CellState } from 'src/app/types/cell-state';
import { CellCoords } from 'src/app/types/cell-coords';
import { range } from 'src/app/helpers/common.helpers';
import { ComboDirection, getComboDirectionNthCell } from 'src/app/types/combo-direction';

@Injectable()
export class Connect4Store extends Store<Connect4StoreState> {
  constructor() {
    super(new Connect4StoreState());
  }

  initState(rows: number, columns: number, connectHowMany: number, firstToken: TokenType) {
    this.setState({
      field: createArray(rows, createArray(columns, 0)),
      connectHowMany,
      cellCombos: this.getCellCombos(rows, columns, connectHowMany),
      nextToken: firstToken,
      winner: undefined,
    });
  }

  dropToken(columnIndex: number) {
    if (!this.canDropToken(columnIndex, this.state.field)) {
      return;
    }
    this.setState({
      ...this.state,
      field: this.dropTokenIntoField(columnIndex, this.state.nextToken, this.state.field),
      nextToken: this.getOtherTokenType(this.state.nextToken),
      winner: undefined,
    });
  }

  private canDropToken(columnIndex: number, field: CellState[][]): boolean {
    return field[0][columnIndex] === 0;
  }

  private getOtherTokenType(tokenType: TokenType): TokenType {
    return tokenType === TokenType.RED ? TokenType.YELLOW : TokenType.RED;
  }

  private dropTokenIntoField(columnIndex: number, tokenType: TokenType, field: CellState[][]): CellState[][] {
    const rowIndex: number = this.getLowestFreeCell(getColumnValues(columnIndex, field));
    const newField: CellState[][] = cloneArray(field);
    newField[rowIndex][columnIndex] = tokenType;
    return newField;
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

  private getCellCombos(rowCount: number, columnCount: number, connectHowMany: number): CellCoords[][] {
    const allDirections: ComboDirection[] = [
      ComboDirection.HORIZONTAL,
      ComboDirection.DIAGONAL_1,
      ComboDirection.VERTICAL,
      ComboDirection.DIAGONAL_2,
    ];

    return allDirections.reduce<CellCoords[][]>(
      (combos, direction) =>
        combos.concat(this.getCellCombosForDirection(rowCount, columnCount, connectHowMany, direction)),
      []
    );
  }

  private getCellCombosForDirection(
    rowCount: number,
    columnCount: number,
    connectHowMany: number,
    direction: ComboDirection
  ): CellCoords[][] {
    let startCells: CellCoords[];

    if (direction !== ComboDirection.DIAGONAL_2) {
      // This is the last cell, from which a combo in this direction can start
      const finalStartCellCoords: CellCoords = getComboDirectionNthCell(
        direction,
        { row: rowCount - 1, column: columnCount - 1 },
        1 - connectHowMany
      );

      // Get a list of all coordinates from which such a combination can start
      startCells = this.getCellCoordsInArea(0, finalStartCellCoords.row + 1, 0, finalStartCellCoords.column + 1);
    } else if (direction === ComboDirection.DIAGONAL_2) {
      // This direction is the exception, because it can't start at coordinates (0, 0)
      startCells = this.getCellCoordsInArea(0, rowCount - (connectHowMany - 1), connectHowMany - 1, columnCount);
    }

    return startCells.map((startCell) => this.extendCombo(direction, connectHowMany, startCell));
  }

  private extendCombo(direction: ComboDirection, length: number, startCell: CellCoords): CellCoords[] {
    return range(0, length).map((i) => getComboDirectionNthCell(direction, startCell, i));
  }

  private getCellCoordsInArea(startRow: number, endRow: number, startColumn: number, endColumn: number): CellCoords[] {
    const result: CellCoords[] = [];
    range(startRow, endRow).forEach((row) =>
      range(startColumn, endColumn).forEach((column) => result.push({ row, column }))
    );
    return result;
  }
}
