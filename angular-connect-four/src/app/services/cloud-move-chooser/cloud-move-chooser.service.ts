import { Connect4StoreState } from "../connect-4/connect-4.store.state";
import { EncodedGameState } from "../../types/encoded-game-state";
import { MoveScore } from "../../types/move-score";
import { encodeGameState } from "../../core/game-state-encoder";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MOVE_CHOOSER_SERVICE_URL } from "./cloud-move-chooser.service.config";

@Injectable()
export class CloudMoveChooserService {
  constructor(private http: HttpClient) { }

  async getBestMoveFromCloud(state: Connect4StoreState, predictionDepth: number): Promise<MoveScore> {
    const encodedState: EncodedGameState = encodeGameState(state);

    return await this.http.get<MoveScore>(MOVE_CHOOSER_SERVICE_URL).toPromise();
  }
}
