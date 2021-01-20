import { Injectable } from "@angular/core";
import { ReducerStore } from "src/app/reducer-store/reducer-store";
import { CheckersStoreState } from "./checkers.store.state";
import { CheckersMoveChooserService } from "./move-chooser/checkers-move-chooser-service";
import { CheckersInitGameReducer } from "./reducers/checkers-init-game-reducer";
import { CheckersTokenType } from "./types/checkers-token-type";

@Injectable()
export class CheckersStore extends ReducerStore<CheckersStoreState> {

  constructor(
    private initGameReducer: CheckersInitGameReducer,
    private moveChooserService: CheckersMoveChooserService
  ) {
    super(new CheckersStoreState());
  }

  initState(rows: number, columns: number, filledRows: number, firstToken: CheckersTokenType, humanPlayers?: CheckersTokenType[]) {
    this.reduce(this.initGameReducer, {rows, columns, filledRows, firstToken, humanPlayers: humanPlayers||[firstToken]});
    this.autoPlayMoveIfComputersTurn();
  }

  private autoPlayMoveIfComputersTurn(){
    if(!this.state.humanPlayers.includes(this.state.nextPlayer)){
      this.moveChooserService.getBestMove(this.state).then(move=>{
        this.playMove(move.move, false);
      });
    }
  }
}
