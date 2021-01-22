import { isDefined } from "@angular/compiler/src/util";
import { Injectable } from "@angular/core";
import { cloneArray } from "src/app/helpers/array.helpers";
import { Reducer } from "src/app/reducer-store/reducer";
import { CheckersStoreState } from "../checkers.store.state";
import { CheckersCellState } from "../types/checkers-cell-state";
import { CheckersMove } from "../types/checkers-move";
import { CheckersMoveType } from "../types/checkers-move-type";
import { CheckersTokenType, KING_TOKENS, WHITE_TOKENS } from "../types/checkers-token-type";
import { getOtherPlayer, getPossibleMoves, getPossibleMovesFromLocation, offsetCoords } from "../utils/checkers-utils";

@Injectable()
export class CheckersPlayMoveReducer implements Reducer<CheckersStoreState, CheckersMove>{
  reduce(state: CheckersStoreState, move: CheckersMove): CheckersStoreState {
    if (state.winner || move.type === undefined) {
      return {...state};
    }
    
    const newField: CheckersCellState[][] = cloneArray(state.field);

    let targetCoords: number[] = offsetCoords(move.direction, [move.row, move.column]);

    if(move.type===CheckersMoveType.JUMP){
      const jumpOverCoords: number[] = [...targetCoords];
      targetCoords = offsetCoords(move.direction, jumpOverCoords);

      newField[jumpOverCoords[0]][jumpOverCoords[1]] = 0; // Remove the jumped-over token
    }

    let tokenType: CheckersTokenType = newField[move.row][move.column];

    if(!KING_TOKENS.includes(tokenType) && (targetCoords[0]===0 || targetCoords[0]===targetCoords.length-1)){
      tokenType = this.getUpgradedToken(tokenType); // Token has reached the end, we can upgrade it
    }

    newField[targetCoords[0]][targetCoords[1]] = tokenType; // This token arrives to the target location
    newField[move.row][move.column] = 0; // The original location is left empty

    let newState: CheckersStoreState = {...state, field: newField};

    const canJumpAgain: boolean = move.type===CheckersMoveType.JUMP && this.canJump(newState, targetCoords);

    if(canJumpAgain){
      return newState;
    }

    newState = {...newState, nextPlayer: getOtherPlayer(state.nextPlayer)};

    if(getPossibleMoves(state).length===0){
      newState = {...newState, winner: state.nextPlayer};
    }

    return newState;
  }

  private getUpgradedToken(tokenType: CheckersTokenType): CheckersTokenType{
    return WHITE_TOKENS.includes(tokenType)?CheckersTokenType.WHITE_KING:CheckersTokenType.BLACK_KING;
  }

  private canJump(state: CheckersStoreState, location: number[]): boolean {
    return getPossibleMovesFromLocation(state, location).some(move=>move.type===CheckersMoveType.JUMP);
  }
}
