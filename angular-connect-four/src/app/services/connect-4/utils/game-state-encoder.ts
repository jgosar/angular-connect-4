import { flip2DArray } from "../../../helpers/array.helpers";
import { Connect4StoreState } from "../connect-4.store.state";
import { Connect4CellState } from "../types/connect-4-cell-state";
import { EncodedGameState } from "../../../types/encoded-game-state";
import { Connect4GameParams } from "../types/connect-4-game-params";
import { Connect4TokenType } from "../types/connect-4-token-type";
import { getLowestFreeCell } from "./connect-4-utils";

export function encodeGameState(state: Connect4StoreState): EncodedGameState{
  return {
    gameParams: encodeGameParams(state),
    columnStates: encodeColumnStates(state.nextPlayer, state.field)
  };
}

function encodeGameParams(state: Connect4StoreState): Connect4GameParams{
  let connectHowMany: number; // The connectHowMany is not directly saved in the state, but we can infer it from the length of possible winning combinations
  if(state.availableCellCombos[Connect4TokenType.RED].length>0){
    connectHowMany = state.availableCellCombos[Connect4TokenType.RED][0].length;
  } else if(state.availableCellCombos[Connect4TokenType.YELLOW].length>0){
    connectHowMany = state.availableCellCombos[Connect4TokenType.YELLOW][0].length;
  } else{
    connectHowMany = 100; //None of the players has a chance to win, so we can just pick some unrealistically high number
  }
  
  return {
    rows: state.field.length,
    columns: state.field[0].length,
    connectHowMany,
    firstToken: state.nextPlayer,
    humanPlayers: state.humanPlayers
  };
}

function encodeColumnStates(playerOne: Connect4TokenType, field: Connect4CellState[][]): number[]{
  return flip2DArray(field).map(columnState=>encodeColumnState(playerOne, columnState));
}

function encodeColumnState(playerOne: Connect4TokenType, columnState: Connect4CellState[]): number{
  // Encode cells in column as binary number digits, add leading digit in case whole column is full
  const lengthenedColumnState: Connect4CellState[] = [0].concat(columnState);
  const bits: number[] = lengthenedColumnState.map(cellState=>cellState===playerOne?1:0);
  const lowestFreeCell: number = getLowestFreeCell(lengthenedColumnState);
  bits[lowestFreeCell]=1;
  return parseInt(bits.join(''), 2);
}
