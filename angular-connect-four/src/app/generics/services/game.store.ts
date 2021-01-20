import { ReducerStore } from "src/app/reducer-store/reducer-store";
import { GameStoreState } from "../game-store.state";
import { MoveChooserService } from "./move-chooser.service";

// A=store state type
// B=move type
// C=player type
export abstract class GameStore<A extends GameStoreState<C>,B,C> extends ReducerStore<A> {

  constructor(
    private initialState: A,
    protected initGameReducer: any,
    protected playMoveReducer: any,
    protected moveChooserService: MoveChooserService<A,B,C>,
  ) {
    super(initialState);
  }

  initState(rows: number, columns: number, connectHowMany: number, firstToken: C, humanPlayers?: C[]) {
    this.reduce(this.initGameReducer, {rows, columns, connectHowMany, firstToken, humanPlayers: humanPlayers||[firstToken]});
    this.autoPlayMoveIfComputersTurn();
  }

  playMove(move: B, playedByAHuman: boolean = true) {
    if(playedByAHuman && !this.state.humanPlayers.includes(this.state.nextPlayer)){
      console.warn("You can't play a move now, the computer is thinking");
      return;
    }
    if(!playedByAHuman && this.state.humanPlayers.includes(this.state.nextPlayer)){
      console.warn("You can't play a move now, the human is thinking");
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
