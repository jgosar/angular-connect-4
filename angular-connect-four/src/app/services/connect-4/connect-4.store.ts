import { Injectable } from '@angular/core';
import { Connect4StoreState } from './connect-4.store.state';
import { Connect4TokenType } from 'src/app/services/connect-4/types/connect-4-token-type';
import { Connect4MoveChooserService } from 'src/app/services/connect-4/move-chooser/connect-4-move-chooser.service';
import { Connect4PlayMoveReducer } from './reducers/connect-4-play-move.reducer';
import { Connect4InitGameReducer } from './reducers/connect-4-init-game-reducer';
import { Connect4Move } from './types/connect-4-move';
import { GameStore } from 'src/app/generics/services/game.store';
import { Connect4GameParams } from './types/connect-4-game-params';

@Injectable()
export class Connect4Store extends GameStore<Connect4StoreState, Connect4Move, Connect4TokenType, Connect4GameParams> {

  constructor(
    protected initGameReducer: Connect4InitGameReducer,
    protected playMoveReducer: Connect4PlayMoveReducer,
    protected moveChooserService: Connect4MoveChooserService,
  ) {
    super(new Connect4StoreState(), initGameReducer, playMoveReducer, moveChooserService);
  }
}
