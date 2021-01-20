import { Injectable } from "@angular/core";

@Injectable()
export class CheckersMoveChooserService {

  async getBestMove(state: CheckersStoreState, predictionDepth?: number): Promise<MoveScore> {
  }
}
