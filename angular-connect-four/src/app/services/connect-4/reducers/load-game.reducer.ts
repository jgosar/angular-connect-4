import { Injectable } from "@angular/core";
import { getOtherTokenType } from "src/app/services/connect-4/utils/connect-4-utils";
import { createArray, flip2DArray } from "src/app/helpers/array.helpers";
import { Reducer } from "src/app/reducer-store/reducer";
import { CellCoords } from "src/app/types/cell-coords";
import { CellState } from "src/app/types/cell-state";
import { EncodedGameState } from "src/app/types/encoded-game-state";
import { Connect4TokenType } from "src/app/services/connect-4/types/connect-4-token-type";
import { Connect4StoreState } from "../connect-4.store.state";
import { Connect4InitGameReducer } from "./connect-4-init-game-reducer";

@Injectable()
export class LoadGameReducer implements Reducer<Connect4StoreState, EncodedGameState>{
  reduce(state: Connect4StoreState, params: EncodedGameState): Connect4StoreState {
    const initGameReducer: Connect4InitGameReducer = new Connect4InitGameReducer();
    const newGameState: Connect4StoreState = initGameReducer.reduce(state, params.gameParams);

    const field: CellState[][] = this.loadCellStatesByColumn(newGameState.nextPlayer, newGameState.field, params.columnStates);
    const allCombos = newGameState.availableCellCombos[Connect4TokenType.RED];
    return {
      ...newGameState,
      field,
      availableCellCombos: {
        [Connect4TokenType.RED]: this.getPossibleCellCombosForPlayer(allCombos, field, Connect4TokenType.RED),
        [Connect4TokenType.YELLOW]: this.getPossibleCellCombosForPlayer(allCombos, field, Connect4TokenType.YELLOW),
      },
    }
  }
  
  private loadCellStatesByColumn(playerOne: Connect4TokenType, field: CellState[][], encodedColumnStates: number[]): CellState[][] {
    const decodedColumnStates: CellState[][] = encodedColumnStates.map(ecs=>this.decodeColumnState(playerOne, field.length, ecs));
    return flip2DArray(decodedColumnStates);
  }

  private decodeColumnState(playerOne: Connect4TokenType, rowCount: number, encodedColumnState: number): CellState[]{
    //0=000=
    //1=001=--
    //2=010=-Y
    //3=011=-R
    //4=100=YY
    //5=101=YR
    //6=110=RY
    //7=111=RR
    if(rowCount===0){
      return [];
    } else if(encodedColumnState<2){
      return createArray(rowCount, 0);
    } else{
      const thisToken: Connect4TokenType = encodedColumnState%2===1?playerOne:getOtherTokenType(playerOne);
      return this.decodeColumnState(playerOne, rowCount-1, Math.floor(encodedColumnState/2)).concat([thisToken]);
    }
  }

  private getPossibleCellCombosForPlayer(allCombos: CellCoords[][], field: CellState[][], player: Connect4TokenType){
    return allCombos.filter(
      (cellCombo) => !cellCombo.some((cell) => field[cell.row][cell.column]===getOtherTokenType(player))
    );
  }
}
