import { sum } from "../../../helpers/array.helpers";
import { range } from "../../../helpers/common.helpers";
import { Connect4StoreState } from "../connect-4.store.state";
import { CellCoords } from "../../../types/cell-coords";
import { Connect4CellState } from "../types/connect-4-cell-state";
import { Connect4TokenType } from "../types/connect-4-token-type";
import { DEFAULT_PREDICTION_DEPTH, PREDICTION_DEPTHS_FOR_POSSIBLE_MOVES } from "./connect-4-move-chooser.service.config";
import { canPlayMove, getOtherTokenType, getWinner } from "../utils/connect-4-utils";
import { Injectable } from "@angular/core";
import { Connect4Move } from "../types/connect-4-move";
import { MoveChooserService } from "src/app/generics/services/move-chooser.service";
import { Reducer } from "src/app/reducer-store/reducer";
import { Connect4PlayMoveReducer } from "../reducers/connect-4-play-move.reducer";

@Injectable()
export class Connect4MoveChooserService extends MoveChooserService<Connect4StoreState, Connect4Move, Connect4TokenType> {

  protected getPredictionDepthForPossibleMoves(possibleMovesCount: number): number{
    return PREDICTION_DEPTHS_FOR_POSSIBLE_MOVES[possibleMovesCount]||DEFAULT_PREDICTION_DEPTH;
  }

  protected getWinner = getWinner;

  protected getPossibleMoves(state: Connect4StoreState): Connect4Move[]{
    if (this.getWinner(state) !== undefined) {
      return [];
    }
    return range(0, state.field[0].length).map(column=>({column})).filter(move => canPlayMove(state, move));
  }

  protected getPlayMoveReducer(): Reducer<Connect4StoreState, Connect4Move>{
    return new Connect4PlayMoveReducer();
  }

  protected getScore(player: Connect4TokenType, state: Connect4StoreState): number {
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

  private getScoreForCombo(playersToken: Connect4TokenType, field: Connect4CellState[][], cellCombo: CellCoords[]): number {
    let score: number;
    const cellStatesInCombo: Connect4CellState[] = cellCombo.map((cellCoords) => field[cellCoords.row][cellCoords.column]);
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
