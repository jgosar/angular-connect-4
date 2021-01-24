import { isDefined } from "src/app/helpers/common.helpers";
import { CheckersStoreState } from "../checkers.store.state";
import { CheckersMove } from "../types/checkers-move";
import { ALL_DIRECTIONS, CheckersMoveDirection, DOWN_DIRECTIONS, UP_DIRECTIONS } from "../types/checkers-move-direction";
import { CheckersMoveType } from "../types/checkers-move-type";
import { CheckersPlayerType } from "../types/checkers-player-type";
import { BLACK_TOKENS, CheckersTokenType, KING_TOKENS } from "../types/checkers-token-type";

export function getMove(state: CheckersStoreState, [row, column]: number[], direction: CheckersMoveDirection): CheckersMove | undefined {
  const nextPlayer: CheckersPlayerType = state.nextPlayer;
  const tokenTypeOnCell: CheckersTokenType | 0 = state.field[row][column];
  if(tokenTypeOnCell===0 || getPlayerForToken(tokenTypeOnCell)!==state.nextPlayer){
    return undefined; // There is no token belonging to the player on this cell
  }
  if(UP_DIRECTIONS.includes(direction) && !tokenCanMoveUp(state.bottomPlayer, tokenTypeOnCell)){
    return undefined; // This token cannot move up
  }
  if(DOWN_DIRECTIONS.includes(direction) && !tokenCanMoveDown(state.bottomPlayer, tokenTypeOnCell)){
    return undefined; // This token cannot move down
  }

  // Check if token can move
  const moveCoords: number[] = offsetCoords(direction, [row, column]);

  if(!areCoordsInField(state.field, moveCoords)){
    return undefined; // This token can't move off the board
  }

  const tokenTypeOnNextCell: CheckersTokenType | 0 = state.field[moveCoords[0]][moveCoords[1]];

  if(tokenTypeOnNextCell===0){
    // Target cell is empty, it's ok to move there
    return {
      row,
      column,
      direction,
      type: CheckersMoveType.MOVE
    };
  }
  if(getPlayerForToken(tokenTypeOnNextCell)===getPlayerForToken(tokenTypeOnCell)){
    return undefined; // Target cell contains friendly token, can't move there or jump over it
  }

  // Check if token can jump
  const jumpCoords: number[] = offsetCoords(direction, moveCoords);

  if(!areCoordsInField(state.field, jumpCoords)){
    return undefined; // This token can't jump off the board
  }

  const tokenTypeOnJumpCell: CheckersTokenType | 0 = state.field[jumpCoords[0]][jumpCoords[1]];

  if(tokenTypeOnJumpCell===0){
    // Ok, can jump
    return {
      row,
      column,
      direction,
      type: CheckersMoveType.JUMP
    };
  }

  return undefined; // First cell in direction is empty and the next is taken, it's not possible to jump there
}

export function getPossibleMovesFromLocation(state: CheckersStoreState, [row, column]: number[]): CheckersMove[]{
  return ALL_DIRECTIONS.map(direction=>getMove(state, [row, column], direction)).filter(isDefined);
}

export function getPossibleMoves(state: CheckersStoreState): CheckersMove[]{
  const allPossibleMoves: CheckersMove[] = getNextPlayersTokenLocations(state).map(location=>getPossibleMovesFromLocation(state, location)).flat();
  // If any jumps are possible, only jumps should be allowed
  if(allPossibleMoves.some(move=>move.type===CheckersMoveType.JUMP)){
    return allPossibleMoves.filter(move=>move.type===CheckersMoveType.JUMP);
  } else{
    return allPossibleMoves;
  }
}

function getNextPlayersTokenLocations(state: CheckersStoreState): number[][]{
  const locations: number[][] = [];
  for(let row=0;row<state.field.length;row++){
    for(let column=0;column<state.field[row].length;column++){
      if(state.field[row][column]!==0 && getPlayerForToken(state.field[row][column])===state.nextPlayer){
        locations.push([row, column]);
      }
    }
  }
  return locations;
}

export function getOtherPlayer(player: CheckersPlayerType): CheckersPlayerType{
  return (player===CheckersPlayerType.WHITE)?CheckersPlayerType.BLACK:CheckersPlayerType.WHITE;
}

export function getPlayerForToken(token: CheckersTokenType): CheckersPlayerType{
  return (BLACK_TOKENS.includes(token))?CheckersPlayerType.BLACK:CheckersPlayerType.WHITE;
}

export function getDefaultTokenForPlayer(player: CheckersPlayerType): CheckersTokenType{
  return (player===CheckersPlayerType.WHITE)?CheckersTokenType.WHITE:CheckersTokenType.BLACK;
}

export function tokenCanMoveUp(bottomPlayer: CheckersPlayerType, token: CheckersTokenType): boolean{
  return getPlayerForToken(token)===bottomPlayer || KING_TOKENS.includes(token);
}

export function tokenCanMoveDown(bottomPlayer: CheckersPlayerType, token: CheckersTokenType): boolean{
  return getPlayerForToken(token)!==bottomPlayer || KING_TOKENS.includes(token);
}

export function offsetCoords(direction: CheckersMoveDirection, [row, column]: number[]): number[]{
  switch(direction){
    case CheckersMoveDirection.UP_LEFT: return [row-1, column-1];
    case CheckersMoveDirection.UP_RIGHT: return [row-1, column+1];
    case CheckersMoveDirection.DOWN_RIGHT: return [row+1, column+1];
    case CheckersMoveDirection.DOWN_LEFT: return [row+1, column-1];
  }
}

function areCoordsInField(field: any[][], [row, column]: number[]): boolean{
  return row>=0 && column>=0 && row<field.length && column<field[0].length;
}
