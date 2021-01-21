import { findMaxAsync } from "src/app/helpers/array.helpers";
import { isDefined } from "src/app/helpers/common.helpers";
import { Reducer } from "src/app/reducer-store/reducer";
import { MoveScore } from "src/app/types/move-score";
import { GameStoreState } from "../game-store.state";

// A=store state type
// B=move type
// C=player type
export abstract class MoveChooserService<A extends GameStoreState<C>,B,C> {
  async getBestMove(state: A, predictionDepth?: number): Promise<MoveScore<B>> {
    if(!isDefined(predictionDepth)){
      const possibleMovesCount: number = this.getPossibleMoves(state).length;
      predictionDepth = this.getPredictionDepthForPossibleMoves(possibleMovesCount);
    }

    const moveScores: Promise<MoveScore<B>>[] = await this.getPossibleMoves(state).map(async (move) => ({
      move,
      score: await this.getMoveScore(state, predictionDepth, move),
    }));
    return await findMaxAsync(moveScores, (moveScore) => moveScore.score);
  }

  protected abstract getPredictionDepthForPossibleMoves(possibleMovesCount: number): number;

  protected abstract getWinner(state: A): C | undefined;

  protected abstract getPossibleMoves(state: A): B[];

  protected abstract getPlayMoveReducer(): Reducer<A, B>;

  protected abstract getScore(player: C, state: A): number;

  private async getMoveScore(state: A, levels: number, move: B): Promise<number> {
    const playMoveReducer: Reducer<A, B> = this.getPlayMoveReducer();
    const nextState: A = playMoveReducer.reduce(state, move);
    if (levels === 0 || this.getWinner(nextState) !== undefined) {
      return this.getScore(state.nextPlayer, nextState);
    } else {
      const bestOpponentsMove: MoveScore<B> = await this.getBestMove(nextState, levels - 1);
      if (bestOpponentsMove === undefined) {
        // No moves are possible because the game is full
        return this.getScore(state.nextPlayer, nextState);
      }
      return -bestOpponentsMove.score;
    }
  }
}
