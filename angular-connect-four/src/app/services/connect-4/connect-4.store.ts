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

  constructor() {
    super(new Connect4StoreState());
  }

  initState(rows: number, columns: number, connectHowMany: number, firstToken: TokenType) {
    this.connectHowMany = connectHowMany;
    const cellCombos: CellCoords[][] = this.getCellCombos(rows, columns);

    this.setState({
      field: createArray(rows, createArray(columns, 0)),
      availableCellCombos: {
        [TokenType.RED]: cellCombos,
        [TokenType.YELLOW]: cellCombos,
      },
      nextToken: firstToken,
      winner: undefined,
    });
  }

  dropToken(columnIndex: number, playNext: boolean = true) {
    if (this.state.winner || !this.canDropToken(this.state.field, columnIndex)) {
      return;
    }
    this.setState(this.dropTokenIntoField(this.state, columnIndex));

    if (playNext) {
      const possibleMovesCount: number = this.getPossibleMoves(this.state).length;
      let predictionDepth: number = 4;
      switch (possibleMovesCount) {
        case 7:
          predictionDepth = 4;
          break;
        case 6:
          predictionDepth = 5;
          break;
        case 5:
          predictionDepth = 6;
          break;
        case 4:
          predictionDepth = 7;
          break;
        case 3:
          predictionDepth = 9;
          break;
        case 2:
          predictionDepth = 13;
          break;
      }
      const computersMove: MoveScore = this.getBestMove(this.state, predictionDepth);
      this.dropToken(computersMove.move, false);
    }
  }

  private canDropToken(field: CellState[][], columnIndex: number): boolean {
    return field[0][columnIndex] === 0;
  }

  private getOtherTokenType(tokenType: TokenType): TokenType {
    return tokenType === TokenType.RED ? TokenType.YELLOW : TokenType.RED;
  }

  private getWinner(state: Connect4StoreState): TokenType | undefined {
    return this.state.availableCellCombos[TokenType.RED]
      .concat(this.state.availableCellCombos[TokenType.YELLOW])
      .map((cellCombo) => this.getWinnerForCombo(state.field, cellCombo))
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

  private dropTokenIntoField(state: Connect4StoreState, columnIndex: number): Connect4StoreState {
    const currentToken: TokenType = state.nextToken;
    const otherToken: TokenType = this.getOtherTokenType(currentToken);
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
      winner: this.getWinner(newState),
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

  private getScore(player: TokenType, state: Connect4StoreState) {
    const playerCombos: CellCoords[][] = this.state.availableCellCombos[player];
    const playerScore: number = sum(
      playerCombos.map((cellCombo) => this.getScoreForCombo(player, state.field, cellCombo))
    );
    const opponent: TokenType = this.getOtherTokenType(player);
    const opponentCombos: CellCoords[][] = this.state.availableCellCombos[opponent];
    const opponentScore: number = sum(
      opponentCombos.map((cellCombo) => this.getScoreForCombo(opponent, state.field, cellCombo))
    );

    return playerScore - opponentScore;
  }

  private getScoreForCombo(playersToken: TokenType, field: CellState[][], cellCombo: CellCoords[]): number {
    const isComboVertical: boolean = cellCombo[0].column == cellCombo[1].column;
    let score: number;
    const cellStatesInCombo: CellState[] = cellCombo.map((cellCoords) => field[cellCoords.row][cellCoords.column]);
    if (cellStatesInCombo.some((cellState) => cellState !== 0 && cellState !== playersToken)) {
      score = 0;
    } else if (cellStatesInCombo.every((cellState) => cellState === playersToken)) {
      score = 10000000;
    } else {
      const playerTokensCount: number = cellStatesInCombo.filter((cellState) => cellState === playersToken).length;
      score = Math.pow(10, playerTokensCount);
    }

    if (isComboVertical) {
      // Vertical combos are trivial to block, so they shouldn't get a very large score
      score /= 5;
    }

    return score;
  }

  private getBestMove(state: Connect4StoreState, levels: number): MoveScore {
    const moveScores: MoveScore[] = this.getPossibleMoves(state).map((move) => ({
      move,
      score: this.getMoveScore(state, levels, move),
    }));
    return findMax(moveScores, (moveScore) => moveScore.score);
  }

  private getPossibleMoves(state: Connect4StoreState): number[] {
    if (this.getWinner(state) !== undefined) {
      return [];
    }
    return range(0, state.field[0].length).filter((column) => this.canDropToken(state.field, column));
  }

  private getMoveScore(state: Connect4StoreState, levels: number, move: number) {
    const nextState: Connect4StoreState = this.dropTokenIntoField(state, move);
    if (levels === 0 || this.getWinner(nextState) !== undefined) {
      return this.getScore(state.nextToken, nextState);
    } else {
      const bestOpponentsMove: MoveScore = this.getBestMove(nextState, levels - 1);
      if (bestOpponentsMove === undefined) {
        // No moves are possible because the game is full
        return this.getScore(state.nextToken, nextState);
      }
      return -bestOpponentsMove.score;
    }
  }
}
