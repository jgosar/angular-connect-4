import { flip2DArray } from "../helpers/array.helpers";
import { Connect4StoreState } from "../services/connect-4/connect-4.store.state";
import { CellState } from "../types/cell-state";
import { EncodedGameState } from "../types/encoded-game-state";
import { GameParams } from "../types/game-params";
import { TokenType } from "../types/token-type";
import { getLowestFreeCell } from "./common-utils";

export function encodeGameState(state: Connect4StoreState): EncodedGameState{
  return {
    gameParams: encodeGameParams(state),
    columnStates: encodeColumnStates(state.nextToken, state.field)
  };
}

function encodeGameParams(state: Connect4StoreState): GameParams{
  let connectHowMany: number; // The connectHowMany is not directly saved in the state, but we can infer it from the length of possible winning combinations
  if(state.availableCellCombos[TokenType.RED].length>0){
    connectHowMany = state.availableCellCombos[TokenType.RED][0].length;
  } else if(state.availableCellCombos[TokenType.YELLOW].length>0){
    connectHowMany = state.availableCellCombos[TokenType.YELLOW][0].length;
  } else{
    connectHowMany = 100; //None of the players has a chance to win, so we can just pick some unrealistically high number
  }
  
  return {
    rows: state.field.length,
    columns: state.field[0].length,
    connectHowMany,
    firstToken: state.nextToken
  };
}

function encodeColumnStates(playerOne: TokenType, field: CellState[][]): number[]{
  return flip2DArray(field).map(columnState=>encodeColumnState(playerOne, columnState));
}

function encodeColumnState(playerOne: TokenType, columnState: CellState[]): number{
  // Encode cells in column as binary number digits, add leading digit in case whole column is full
  const lengthenedColumnState: CellState[] = [0].concat(columnState);
  const bits: number[] = lengthenedColumnState.map(cellState=>cellState===playerOne?1:0);
  const lowestFreeCell: number = getLowestFreeCell(lengthenedColumnState);
  bits[lowestFreeCell]=1;
  return parseInt(bits.join(''), 2);
}
