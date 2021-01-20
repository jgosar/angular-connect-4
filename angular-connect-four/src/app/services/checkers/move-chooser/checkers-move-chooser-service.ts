import { Injectable } from "@angular/core";
import { MoveChooserService } from "src/app/generics/services/move-chooser.service";
import { CheckersStoreState } from "../checkers.store.state";
import { CheckersMove } from "../types/checkers-move";
import { CheckersPlayerType } from "../types/checkers-player-type";

@Injectable()
export class CheckersMoveChooserService extends MoveChooserService<CheckersStoreState, CheckersMove, CheckersPlayerType> {
}
