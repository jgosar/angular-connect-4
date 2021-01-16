import { Injectable } from "@angular/core";
import { getOtherTokenType } from "src/app/core/common-utils";
import { createArray, flip2DArray } from "src/app/helpers/array.helpers";
import { Reducer } from "src/app/reducer-store/reducer";
import { CellCoords } from "src/app/types/cell-coords";
import { CellState } from "src/app/types/cell-state";
import { EncodedGameState } from "src/app/types/encoded-game-state";
import { TokenType } from "src/app/types/token-type";
import { Connect4StoreState } from "../connect-4.store.state";
import { InitGameReducer } from "./init-game-reducer";

@Injectable()
export class LoadGameReducer implements Reducer<Connect4StoreState, EncodedGameState>{
  reduce(state: Connect4StoreState, params: EncodedGameState): Connect4StoreState {
    const initGameReducer: InitGameReducer = new InitGameReducer();
    const newGameState: Connect4StoreState = initGameReducer.reduce(state, params.gameParams);

    const field: CellState[][] = this.loadCellStatesByColumn(newGameState.nextToken, newGameState.field, params.columnStates);
    const allCombos = newGameState.availableCellCombos[TokenType.RED];
    return {
      ...newGameState,
      field,
      availableCellCombos: {
        [TokenType.RED]: this.getPossibleCellCombosForPlayer(allCombos, field, TokenType.RED),
        [TokenType.YELLOW]: this.getPossibleCellCombosForPlayer(allCombos, field, TokenType.YELLOW),
      },
    }
  }
  
  private loadCellStatesByColumn(playerOne: TokenType, field: CellState[][], encodedColumnStates: number[]): CellState[][] {
    const decodedColumnStates: CellState[][] = encodedColumnStates.map(ecs=>this.decodeColumnState(playerOne, field.length, ecs));
    return flip2DArray(decodedColumnStates);
  }

  private decodeColumnState(playerOne: TokenType, rowCount: number, encodedColumnState: number): CellState[]{
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
      const thisToken: TokenType = encodedColumnState%2===1?playerOne:getOtherTokenType(playerOne);
      return this.decodeColumnState(playerOne, rowCount-1, Math.floor(encodedColumnState/2)).concat([thisToken]);
    }
  }

  private getPossibleCellCombosForPlayer(allCombos: CellCoords[][], field: CellState[][], player: TokenType){
    return allCombos.filter(
      (cellCombo) => !cellCombo.some((cell) => field[cell.row][cell.column]===getOtherTokenType(player))
    );
  }
}
