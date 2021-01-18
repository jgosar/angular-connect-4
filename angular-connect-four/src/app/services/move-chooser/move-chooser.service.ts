import { findMax, findMaxAsync, sum } from "../../helpers/array.helpers";
import { isDefined, range } from "../../helpers/common.helpers";
import { Connect4StoreState } from "../connect-4/connect-4.store.state";
import { DropTokenReducer } from "../connect-4/reducers/drop-token.reducer";
import { CellCoords } from "../../types/cell-coords";
import { CellState } from "../../types/cell-state";
import { MoveScore } from "../../types/move-score";
import { TokenType } from "../../types/token-type";
import { DEFAULT_PREDICTION_DEPTH, PREDICTION_DEPTHS_FOR_POSSIBLE_MOVES } from "./move-chooser.service.config";
import { canDropToken, getOtherTokenType, getWinner } from "../../core/common-utils";
import { Injectable } from "@angular/core";
import { CloudMoveChooserService } from "../cloud-move-chooser/cloud-move-chooser.service";

@Injectable()
export class MoveChooserService {
  constructor(private cloudService: CloudMoveChooserService){}

  async getBestMove(state: Connect4StoreState, predictionDepth?: number): Promise<MoveScore> {
    if(!isDefined(predictionDepth)){
      const possibleMovesCount: number = this.getPossibleMoves(state).length;
      predictionDepth = PREDICTION_DEPTHS_FOR_POSSIBLE_MOVES[possibleMovesCount]||DEFAULT_PREDICTION_DEPTH;
    }

    /*if(predictionDepth>5){
      return this.cloudService.getBestMoveFromCloud(state, predictionDepth);
    }*/

    const moveScores: Promise<MoveScore>[] = await this.getPossibleMoves(state).map(async (move) => ({
      move,
      score: await this.getMoveScore(state, predictionDepth, move),
    }));
    return await findMaxAsync(moveScores, (moveScore) => moveScore.score);
  }

  private getPossibleMoves(state: Connect4StoreState): number[] {
      if (getWinner(state) !== undefined) {
        return [];
      }
      return range(0, state.field[0].length).filter((column) => canDropToken(state.field, column));
    }

  private async getMoveScore(state: Connect4StoreState, levels: number, move: number): Promise<number> {
    const dropTokenReducer: DropTokenReducer = new DropTokenReducer();
    const nextState: Connect4StoreState = dropTokenReducer.reduce(state, {columnIndex: move});
    if (levels === 0 || getWinner(nextState) !== undefined) {
      return this.getScore(state.nextToken, nextState);
    } else {
      const bestOpponentsMove: MoveScore = await this.getBestMove(nextState, levels - 1);
      if (bestOpponentsMove === undefined) {
        // No moves are possible because the game is full
        return this.getScore(state.nextToken, nextState);
      }
      return -bestOpponentsMove.score;
    }
  }

  private getScore(player: TokenType, state: Connect4StoreState): number {
    const playerCombos: CellCoords[][] = state.availableCellCombos[player];
    const playerScore: number = sum(
      playerCombos.map((cellCombo) => this.getScoreForCombo(player, state.field, cellCombo))
    );
    const opponent: TokenType = getOtherTokenType(player);
    const opponentCombos: CellCoords[][] = state.availableCellCombos[opponent];
    const opponentScore: number = sum(
      opponentCombos.map((cellCombo) => this.getScoreForCombo(opponent, state.field, cellCombo))
    );

    return playerScore - opponentScore;
  }

  private getScoreForCombo(playersToken: TokenType, field: CellState[][], cellCombo: CellCoords[]): number {
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
