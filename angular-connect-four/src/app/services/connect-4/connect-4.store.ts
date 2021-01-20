import { Injectable } from '@angular/core';
import { Connect4StoreState } from './connect-4.store.state';
import { Connect4TokenType } from 'src/app/services/connect-4/types/connect-4-token-type';
import { Connect4MoveChooserService } from 'src/app/services/connect-4/move-chooser/connect-4-move-chooser.service';
import { Connect4PlayMoveReducer } from './reducers/connect-4-play-move.reducer';
import { Connect4InitGameReducer } from './reducers/connect-4-init-game-reducer';
import { ReducerStore } from 'src/app/reducer-store/reducer-store';
import { LoadGameReducer } from './reducers/load-game.reducer';
import { Connect4Move } from './types/connect-4-move';

@Injectable()
export class Connect4Store extends ReducerStore<Connect4StoreState> {

  constructor(
    private initGameReducer: Connect4InitGameReducer,
    private playMoveReducer: Connect4PlayMoveReducer,
    private loadGameReducer: LoadGameReducer,
    private moveChooserService: Connect4MoveChooserService
  ) {
    super(new Connect4StoreState());
  }

  initState(rows: number, columns: number, connectHowMany: number, firstToken: Connect4TokenType, humanPlayers?: Connect4TokenType[]) {
    this.reduce(this.initGameReducer, {rows, columns, connectHowMany, firstToken, humanPlayers: humanPlayers||[firstToken]});
    this.autoPlayMoveIfComputersTurn();
  }

  loadState(rows: number, columns: number, connectHowMany: number, firstToken: Connect4TokenType, columnStates: number[]) {
    this.reduce(this.loadGameReducer, {gameParams: {rows, columns, connectHowMany, firstToken, humanPlayers: [firstToken]}, columnStates});
  }

  playMove(move: Connect4Move, playedByAHuman: boolean = true) {
    if(playedByAHuman && !this.state.humanPlayers.includes(this.state.nextPlayer)){
      console.warn("You can't drop a token now, the computer is thinking");
      return;
    }
    if(!playedByAHuman && this.state.humanPlayers.includes(this.state.nextPlayer)){
      console.warn("You can't drop a token now, the human is thinking");
      return;
    }

    this.reduce(this.playMoveReducer, move);

    setTimeout(()=>{
      this.autoPlayMoveIfComputersTurn();
    });
  }

  private autoPlayMoveIfComputersTurn(){
    if(!this.state.humanPlayers.includes(this.state.nextPlayer)){
      this.moveChooserService.getBestMove(this.state).then(moveScore=>{
        this.playMove(moveScore.move, false);
      });
    }
  }
}
