import { Injectable } from '@angular/core';
import { Connect4StoreState } from './connect-4.store.state';
import { Store } from 'rxjs-observable-store';
import { TokenType } from 'src/app/types/token-type';
import { createArray, getColumnValues, cloneArray, sum, findMax } from '../../helpers/array.helpers';
import { CellState } from 'src/app/types/cell-state';
import { CellCoords } from 'src/app/types/cell-coords';
import { range } from 'src/app/helpers/common.helpers';
import { ComboDirection, getComboDirectionNthCell } from 'src/app/types/combo-direction';
import { MoveScore } from 'src/app/types/move-rating';

@Injectable()
export class Connect4Store extends Store<Connect4StoreState> {
  private connectHowMany: number;
  private cellCombos: CellCoords[][];

  constructor() {
    super(new Connect4StoreState());
  }

  initState(rows: number, columns: number, connectHowMany: number, firstToken: TokenType) {
    this.connectHowMany = connectHowMany;
    this.cellCombos = this.getCellCombos(rows, columns);

    this.setState({
      field: createArray(rows, createArray(columns, 0)),
      nextToken: firstToken,
      winner: undefined,
    });
  }

  dropToken(columnIndex: number, playNext: boolean = true) {
    if (this.state.winner || !this.canDropToken(this.state.field, columnIndex)) {
      return;
    }
    const newField: CellState[][] = this.dropTokenIntoField(this.state.field, this.state.nextToken, columnIndex);
    this.setState({
      ...this.state,
      field: newField,
      nextToken: this.getOtherTokenType(this.state.nextToken),
      winner: this.getWinner(newField),
    });

    if (playNext) {
      const computersMove: MoveScore = this.getBestMove(this.state.nextToken, this.state.field, 4);
      this.dropToken(computersMove.move, false);
    }
  }

  private canDropToken(field: CellState[][], columnIndex: number): boolean {
    return field[0][columnIndex] === 0;
  }

  private getOtherTokenType(tokenType: TokenType): TokenType {
    return tokenType === TokenType.RED ? TokenType.YELLOW : TokenType.RED;
  }

  private getWinner(field: CellState[][]): TokenType | undefined {
    return this.cellCombos
      .map((cellCombo) => this.getWinnerForCombo(field, cellCombo))
      .find((winner) => winner !== undefined);
  }

  private getWinnerForCombo(field: CellState[][], cellCombo: CellCoords[]): TokenType | undefined {
    const cellStatesInCombo: CellState[] = cellCombo.map((cellCoords) => field[cellCoords.row][cellCoords.column]);
    if (cellStatesInCombo.every((cellState) => cellState === TokenType.RED)) {
      return TokenType.RED;
    } else if (cellStatesInCombo.every((cellState) => cellState === TokenType.YELLOW)) {
      return TokenType.YELLOW;
    }
  }

  private dropTokenIntoField(field: CellState[][], tokenType: TokenType, columnIndex: number): CellState[][] {
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

  private getCellCombos(rowCount: number, columnCount: number): CellCoords[][] {
    const allDirections: ComboDirection[] = [
      ComboDirection.HORIZONTAL,
      ComboDirection.DIAGONAL_1,
      ComboDirection.VERTICAL,
      ComboDirection.DIAGONAL_2,
    ];

    return allDirections.reduce<CellCoords[][]>(
      (combos, direction) => combos.concat(this.getCellCombosForDirection(rowCount, columnCount, direction)),
      []
    );
  }

  private getCellCombosForDirection(rowCount: number, columnCount: number, direction: ComboDirection): CellCoords[][] {
    let startCells: CellCoords[];

    if (direction !== ComboDirection.DIAGONAL_2) {
      // This is the last cell, from which a combo in this direction can start
      const finalStartCellCoords: CellCoords = getComboDirectionNthCell(
        direction,
        { row: rowCount - 1, column: columnCount - 1 },
        1 - this.connectHowMany
      );

      // Get a list of all coordinates from which such a combination can start
      startCells = this.getCellCoordsInArea(0, finalStartCellCoords.row + 1, 0, finalStartCellCoords.column + 1);
    } else if (direction === ComboDirection.DIAGONAL_2) {
      // This direction is the exception, because it can't start at coordinates (0, 0)
      startCells = this.getCellCoordsInArea(
        0,
        rowCount - (this.connectHowMany - 1),
        this.connectHowMany - 1,
        columnCount
      );
    }

    return startCells.map((startCell) => this.extendCombo(direction, this.connectHowMany, startCell));
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

  private getScore(player: TokenType, field: CellState[][]) {
    const playerScore: number = sum(
      this.cellCombos.map((cellCombo) => this.getScoreForCombo(player, field, cellCombo))
    );
    const opponentScore: number = sum(
      this.cellCombos.map((cellCombo) => this.getScoreForCombo(this.getOtherTokenType(player), field, cellCombo))
    );

    return playerScore - opponentScore;
  }

  private getScoreForCombo(playersToken: TokenType, field: CellState[][], cellCombo: CellCoords[]): number {
    const cellStatesInCombo: CellState[] = cellCombo.map((cellCoords) => field[cellCoords.row][cellCoords.column]);
    if (cellStatesInCombo.some((cellState) => cellState !== 0 && cellState !== playersToken)) {
      return 0;
    } else if (cellStatesInCombo.every((cellState) => cellState === playersToken)) {
      return 10000000;
    } else {
      const playerTokensCount: number = cellStatesInCombo.filter((cellState) => cellState === playersToken).length;
      if (playerTokensCount === 0) {
        return 0;
      } else {
        return Math.pow(10, playerTokensCount);
      }
    }
  }

  private getBestMove(playersToken: TokenType, field: CellState[][], levels: number): MoveScore {
    const moveScores: MoveScore[] = this.getPossibleMoves(field).map((move) => ({
      move,
      score: this.getMoveScore(playersToken, field, levels, move),
    }));
    return findMax(moveScores, (moveScore) => moveScore.score);
  }

  private getPossibleMoves(field: CellState[][]): number[] {
    if (this.getWinner(field) !== undefined) {
      return [];
    }
    return range(0, field[0].length).filter((column) => this.canDropToken(field, column));
  }

  private getMoveScore(playersToken: TokenType, field: CellState[][], levels: number, move: number) {
    const nextField: CellState[][] = this.dropTokenIntoField(field, playersToken, move);
    if (levels === 0 || this.getWinner(nextField) !== undefined) {
      return this.getScore(playersToken, nextField);
    } else {
      const bestOpponentsMove: MoveScore = this.getBestMove(
        this.getOtherTokenType(playersToken),
        nextField,
        levels - 1
      );
      if (bestOpponentsMove === undefined) {
        // No moves are possible because the game is full
        return this.getScore(playersToken, nextField);
      }
      return -bestOpponentsMove.score;
    }
  }
}
