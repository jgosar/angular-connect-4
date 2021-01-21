import { Injectable } from "@angular/core";
import { MoveChooserService } from "src/app/generics/services/move-chooser.service";
import { Reducer } from "src/app/reducer-store/reducer";
import { CheckersStoreState } from "../checkers.store.state";
import { CheckersMove } from "../types/checkers-move";
import { CheckersPlayerType } from "../types/checkers-player-type";

@Injectable()
export class CheckersMoveChooserService extends MoveChooserService<CheckersStoreState, CheckersMove, CheckersPlayerType> {
  protected getPredictionDepthForPossibleMoves(possibleMovesCount: number): number{
    return 2; // TODO
  }

  protected getWinner(state: CheckersStoreState): CheckersPlayerType | undefined{
    // TODO: If a player has no more tokens, the other player wins
    // TODO: If a player whose turn it is has no valid moves, the other player wins
    return undefined;
  }

  protected getPossibleMoves(state: CheckersStoreState): CheckersMove[]{
    return []; // TODO
  }

  protected getPlayMoveReducer(): Reducer<CheckersStoreState, CheckersMove>{
    return undefined; // TODO
  }

  protected getScore(player: CheckersPlayerType, state: CheckersStoreState): number{
    return 0; // TODO
  }
}
