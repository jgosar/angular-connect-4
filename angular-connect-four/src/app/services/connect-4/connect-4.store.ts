import { Injectable } from '@angular/core';
import { Connect4StoreState } from './connect-4.store.state';
import { TokenType } from 'src/app/types/token-type';
import { MoveScore } from 'src/app/types/move-score';
import { MoveChooserService } from 'src/app/services/move-chooser/move-chooser.service';
import { DropTokenReducer } from './reducers/drop-token.reducer';
import { InitGameReducer } from './reducers/init-game-reducer';
import { ReducerStore } from 'src/app/reducer-store/reducer-store';
import { LoadGameReducer } from './reducers/load-game.reducer';

@Injectable()
export class Connect4Store extends ReducerStore<Connect4StoreState> {

  constructor(
    private initGameReducer: InitGameReducer,
    private dropTokenReducer: DropTokenReducer,
    private loadGameReducer: LoadGameReducer,
    private moveChooserService: MoveChooserService
  ) {
    super(new Connect4StoreState());
  }

  initState(rows: number, columns: number, connectHowMany: number, firstToken: TokenType, humanPlayers?: TokenType[]) {
    this.reduce(this.initGameReducer, {rows, columns, connectHowMany, firstToken, humanPlayers: humanPlayers||[firstToken]});
    this.autoPlayMoveIfComputersTurn();
  }

  loadState(rows: number, columns: number, connectHowMany: number, firstToken: TokenType, columnStates: number[]) {
    this.reduce(this.loadGameReducer, {gameParams: {rows, columns, connectHowMany, firstToken, humanPlayers: [firstToken]}, columnStates});
  }

  dropToken(columnIndex: number, playedByAHuman: boolean = true) {
    if(playedByAHuman && !this.state.humanPlayers.includes(this.state.nextToken)){
      console.warn("You can't drop a token now, the computer is thinking");
      return;
    }
    if(!playedByAHuman && this.state.humanPlayers.includes(this.state.nextToken)){
      console.warn("You can't drop a token now, the human is thinking");
      return;
    }

    this.reduce(this.dropTokenReducer, {columnIndex});

    setTimeout(()=>{
      this.autoPlayMoveIfComputersTurn();
    });
  }

  private autoPlayMoveIfComputersTurn(){
    if(!this.state.humanPlayers.includes(this.state.nextToken)){
      this.moveChooserService.getBestMove(this.state).then(move=>{
        this.dropToken(move.move, false);
      });
    }
  }
}
