import { Injectable } from "@angular/core";
import { GameStore } from "src/app/generics/services/game.store";
import { CheckersStoreState } from "./checkers.store.state";
import { CheckersMoveChooserService } from "./move-chooser/checkers-move-chooser-service";
import { CheckersInitGameReducer } from "./reducers/checkers-init-game-reducer";
import { CheckersPlayMoveReducer } from "./reducers/checkers-play-move-reducer";
import { CheckersGameParams } from "./types/checkers-game-params";
import { CheckersMove } from "./types/checkers-move";
import { CheckersPlayerType } from "./types/checkers-player-type";

@Injectable()
export class CheckersStore extends GameStore<CheckersStoreState, CheckersMove, CheckersPlayerType, CheckersGameParams> {

  constructor(
    protected initGameReducer: CheckersInitGameReducer,
    protected playMoveReducer: CheckersPlayMoveReducer,
    protected moveChooserService: CheckersMoveChooserService,
  ) {
    super(new CheckersStoreState(), initGameReducer, playMoveReducer, moveChooserService);
  }
}
