import { Injectable } from '@angular/core';
import { Connect4StoreState } from './connect-4.store.state';
import { TokenType } from 'src/app/types/token-type';
import { MoveScore } from 'src/app/types/move-rating';
import { getBestMove } from 'src/app/core/move-chooser';
import { DropTokenReducer } from './reducers/drop-token.reducer';
import { InitGameReducer } from './reducers/init-game-reducer';
import { ReducerStore } from 'src/app/reducer-store/reducer-store';

@Injectable()
export class Connect4Store extends ReducerStore<Connect4StoreState> {

  constructor(
    private initGameReducer: InitGameReducer,
    private dropTokenReducer: DropTokenReducer
  ) {
    super(new Connect4StoreState());
  }

  initState(rows: number, columns: number, connectHowMany: number, firstToken: TokenType) {
    this.reduce(this.initGameReducer, {rows, columns, connectHowMany, firstToken});
  }

  dropToken(columnIndex: number, playNext: boolean = true) {
    this.reduce(this.dropTokenReducer, {columnIndex});

    if (playNext && !this.state.winner) {
      const computersMove: MoveScore = getBestMove(this.state);
      this.dropToken(computersMove.move, false);
    }
  }
}
