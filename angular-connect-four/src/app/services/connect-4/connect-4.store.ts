import { Injectable } from '@angular/core';
import { Connect4StoreState } from './connect-4.store.state';
import { Store } from 'rxjs-observable-store';
import { TokenType } from 'src/app/types/token-type';
import { MoveScore } from 'src/app/types/move-rating';
import { getBestMove } from 'src/app/core/move-chooser';
import { DropTokenReducer } from './reducers/drop-token.reducer';
import { InitGameReducer } from './reducers/init-game-reducer';

@Injectable()
export class Connect4Store extends Store<Connect4StoreState> {

  constructor(private initGameReducer: InitGameReducer,
      private dropTokenReducer: DropTokenReducer) {
    super(new Connect4StoreState());
  }

  initState(rows: number, columns: number, connectHowMany: number, firstToken: TokenType) {
    this.setState(this.initGameReducer.reduce(this.state, {rows, columns, connectHowMany, firstToken}));
  }

  dropToken(columnIndex: number, playNext: boolean = true) {
    this.setState(this.dropTokenReducer.reduce(this.state, {columnIndex}));

    if (playNext && !this.state.winner) {
      const computersMove: MoveScore = getBestMove(this.state);
      this.dropToken(computersMove.move, false);
    }
  }
}
