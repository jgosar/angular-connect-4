import { findMaxAsync, sum } from "../../../helpers/array.helpers";
import { isDefined, range } from "../../../helpers/common.helpers";
import { Connect4StoreState } from "../connect-4.store.state";
import { Connect4PlayMoveReducer } from "../reducers/connect-4-play-move.reducer";
import { CellCoords } from "../../../types/cell-coords";
import { CellState } from "../../../types/cell-state";
import { MoveScore } from "../../../types/move-score";
import { Connect4TokenType } from "../types/connect-4-token-type";
import { DEFAULT_PREDICTION_DEPTH, PREDICTION_DEPTHS_FOR_POSSIBLE_MOVES } from "./connect-4-move-chooser.service.config";
import { canPlayMove, getOtherTokenType, getWinner } from "../utils/connect-4-utils";
import { Injectable } from "@angular/core";
import { Connect4Move } from "../types/connect-4-move";

@Injectable()
export class Connect4MoveChooserService {
  async getBestMove(state: Connect4StoreState, predictionDepth?: number): Promise<MoveScore<Connect4Move>> {
    if(!isDefined(predictionDepth)){
      const possibleMovesCount: number = this.getPossibleMoves(state).length;
      predictionDepth = PREDICTION_DEPTHS_FOR_POSSIBLE_MOVES[possibleMovesCount]||DEFAULT_PREDICTION_DEPTH;
    }

    const moveScores: Promise<MoveScore<Connect4Move>>[] = await this.getPossibleMoves(state).map(async (move) => ({
      move,
      score: await this.getMoveScore(state, predictionDepth, move),
    }));
    return await findMaxAsync(moveScores, (moveScore) => moveScore.score);
  }

  private getPossibleMoves(state: Connect4StoreState): Connect4Move[] {
      if (getWinner(state) !== undefined) {
        return [];
      }
      return range(0, state.field[0].length).map(column=>({column})).filter(move => canPlayMove(state.field, move));
    }

  private async getMoveScore(state: Connect4StoreState, levels: number, move: Connect4Move): Promise<number> {
    const playMoveReducer: Connect4PlayMoveReducer = new Connect4PlayMoveReducer();
    const nextState: Connect4StoreState = playMoveReducer.reduce(state, move);
    if (levels === 0 || getWinner(nextState) !== undefined) {
      return this.getScore(state.nextPlayer, nextState);
    } else {
      const bestOpponentsMove: MoveScore<Connect4Move> = await this.getBestMove(nextState, levels - 1);
      if (bestOpponentsMove === undefined) {
        // No moves are possible because the game is full
        return this.getScore(state.nextPlayer, nextState);
      }
      return -bestOpponentsMove.score;
    }
  }

  private getScore(player: Connect4TokenType, state: Connect4StoreState): number {
    const playerCombos: CellCoords[][] = state.availableCellCombos[player];
    const playerScore: number = sum(
      playerCombos.map((cellCombo) => this.getScoreForCombo(player, state.field, cellCombo))
    );
    const opponent: Connect4TokenType = getOtherTokenType(player);
    const opponentCombos: CellCoords[][] = state.availableCellCombos[opponent];
    const opponentScore: number = sum(
      opponentCombos.map((cellCombo) => this.getScoreForCombo(opponent, state.field, cellCombo))
    );

    return playerScore - opponentScore;
  }

  private getScoreForCombo(playersToken: Connect4TokenType, field: CellState[][], cellCombo: CellCoords[]): number {
    let score: number;
    const cellStatesInCombo: CellState[] = cellCombo.map((cellCoords) => field[cellCoords.row][cellCoords.column]);
    if (cellStatesInCombo.some((cellState) => cellState !== 0 && cellState !== playersToken)) {
      return 0;
    } else if (cellStatesInCombo.every((cellState) => cellState === playersToken)) {
      score = 10000000;
    } else {
      const playerTokensCount: number = cellStatesInCombo.filter((cellState) => cellState === playersToken).length;
      score = Math.pow(10, playerTokensCount);
    }

    const isComboVertical: boolean = cellCombo[0].column == cellCombo[1].column;
    if (isComboVertical) {
      // Vertical combos are trivial to block, so they shouldn't get a very large score
      score /= 5;
    }

    return score;
  }
}
