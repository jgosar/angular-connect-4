import { Injectable } from "@angular/core";
import { MoveChooserService } from "src/app/generics/services/move-chooser.service";
import { Reducer } from "src/app/reducer-store/reducer";
import { CheckersStoreState } from "../checkers.store.state";
import { CheckersPlayMoveReducer } from "../reducers/checkers-play-move-reducer";
import { CheckersMove } from "../types/checkers-move";
import { CheckersPlayerType } from "../types/checkers-player-type";
import { CheckersTokenType } from "../types/checkers-token-type";
import { getOtherPlayer, getPossibleMoves } from "../utils/checkers-utils";

@Injectable()
export class CheckersMoveChooserService extends MoveChooserService<CheckersStoreState, CheckersMove, CheckersPlayerType> {
  protected getPredictionDepthForPossibleMoves(possibleMovesCount: number): number{
    return 3; // TODO
  }

  protected getWinner(state: CheckersStoreState): CheckersPlayerType | undefined{
    return state.winner;
  }

  protected getPossibleMoves(state: CheckersStoreState): CheckersMove[]{
    return getPossibleMoves(state);
  }

  protected getPlayMoveReducer(): Reducer<CheckersStoreState, CheckersMove>{
    return new CheckersPlayMoveReducer();
  }

  protected getScore(player: CheckersPlayerType, state: CheckersStoreState): number{
    return this.getPlayerScore(player, state) - this.getPlayerScore(getOtherPlayer(player), state);
  }

  private getPlayerScore(player: CheckersPlayerType, state: CheckersStoreState): number{
    const isBottomPlayer: boolean = player === state.bottomPlayer;

    const normalTokenType: CheckersTokenType = player === CheckersPlayerType.WHITE ? CheckersTokenType.WHITE:CheckersTokenType.BLACK;
    const kingTokenType: CheckersTokenType = player === CheckersPlayerType.WHITE ? CheckersTokenType.WHITE_KING:CheckersTokenType.BLACK_KING;

    let score: number = 0;

    for(let row=0;row<state.field.length;row++){
      for(let column=0;column<state.field[row].length;column++){
        if(state.field[row][column] === normalTokenType){
          score+=100;
          const traversedRows: number = isBottomPlayer? (state.field.length-1)-row:row;
          score+=traversedRows*traversedRows;
        } else if(state.field[row][column] === kingTokenType){
          score += 200;
        }
      }
    }

    const randomScoreModifier: number = 1+Math.random()*0.1;
    return score*randomScoreModifier;
  }
}
