import { Injectable } from '@angular/core';
import { Connect4StoreState } from './connect-4.store.state';
import { TokenType } from 'src/app/types/token-type';
import { MoveScore } from 'src/app/types/move-rating';
import { getBestMove } from 'src/app/core/move-chooser';
import { DropTokenReducer } from './reducers/drop-token.reducer';
import { InitGameReducer } from './reducers/init-game-reducer';
import { ReducerStore } from 'src/app/reducer-store/reducer-store';
import { LoadGameReducer } from './reducers/load-game.reducer';

@Injectable()
export class Connect4Store extends ReducerStore<Connect4StoreState> {

  constructor(
    private initGameReducer: InitGameReducer,
    private dropTokenReducer: DropTokenReducer,
    private loadGameReducer: LoadGameReducer
  ) {
    super(new Connect4StoreState());
  }

  initState(rows: number, columns: number, connectHowMany: number, firstToken: TokenType) {
    this.reduce(this.initGameReducer, {rows, columns, connectHowMany, firstToken});
  }

  loadState(rows: number, columns: number, connectHowMany: number, firstToken: TokenType, columnStates: number[]) {
    this.reduce(this.loadGameReducer, {gameParams: {rows, columns, connectHowMany, firstToken}, columnStates});
  }

  dropToken(columnIndex: number, playNext: boolean = true) {
    this.reduce(this.dropTokenReducer, {columnIndex});

    if (playNext && !this.state.winner) {
      const computersMove: MoveScore = getBestMove(this.state);
      this.dropToken(computersMove.move, false);
    }
  }
}
