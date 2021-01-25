import { Reducer } from "src/app/reducer-store/reducer";
import { ReducerStore } from "src/app/reducer-store/reducer-store";
import { GameStoreState } from "../game-store.state";
import { MoveChooserService } from "./move-chooser.service";

// A=store state type
// B=move type
// C=player type
// D=init game params
export abstract class GameStore<A extends GameStoreState<C>,B,C,D> extends ReducerStore<A> {

  constructor(
    private initialState: A,
    protected initGameReducer: Reducer<A, D>,
    protected playMoveReducer: Reducer<A, B>,
    protected moveChooserService: MoveChooserService<A,B,C>,
  ) {
    super(initialState);
  }

  initState(gameParams: D) {
    this.reduce(this.initGameReducer, gameParams);
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
    if(!this.state.winner && !this.state.humanPlayers.includes(this.state.nextPlayer)){
      this.moveChooserService.getBestMove(this.state).then(moveScore=>{
        this.playMove(moveScore.move, false);
      });
    }
  }
}
