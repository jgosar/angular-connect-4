import { Injectable } from '@angular/core';
import { Connect4StoreState } from './connect-4.store.state';
import { Store } from 'rxjs-observable-store';
import { TokenType } from 'src/app/types/token-type';
import {
  createArray,
  getColumnValues,
  cloneArray,
} from '../../helpers/array.helpers';
import { CellState } from 'src/app/types/cell-state';

@Injectable()
export class Connect4Store extends Store<Connect4StoreState> {
  constructor() {
    super(new Connect4StoreState());
  }

  initState(rows: number, columns: number, firstToken: TokenType) {
    this.setState({
      field: createArray(rows, createArray(columns, 0)),
      nextToken: firstToken,
      winner: undefined,
    });
  }

  dropToken(columnIndex: number) {
    if (!this.canDropToken(columnIndex, this.state.field)) {
      return;
    }
    this.setState({
      field: this.dropTokenIntoField(
        columnIndex,
        this.state.nextToken,
        this.state.field
      ),
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

  private dropTokenIntoField(
    columnIndex: number,
    tokenType: TokenType,
    field: CellState[][]
  ): CellState[][] {
    const rowIndex: number = this.getLowestFreeCell(
      getColumnValues(columnIndex, field)
    );
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
}
