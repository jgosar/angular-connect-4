import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CheckersStore } from 'src/app/services/checkers/checkers.store';
import { CheckersMove } from 'src/app/services/checkers/types/checkers-move';
import { CheckersMoveDirection } from 'src/app/services/checkers/types/checkers-move-direction';
import { CheckersMoveType } from 'src/app/services/checkers/types/checkers-move-type';
import { CheckersPlayerType } from 'src/app/services/checkers/types/checkers-player-type';
import { getPossibleMoves, getPossibleMovesFromLocation, offsetCoords } from 'src/app/services/checkers/utils/checkers-utils';

@Component({
  selector: 'acf-checkers',
  templateUrl: './checkers.component.html',
  styleUrls: ['./checkers.component.less'],
})
export class CheckersComponent implements OnInit {
  activeCell: number[];
  targetCells: number[][] = [];
  possibleMoves: CheckersMove[];
  
  private ngUnsubscribe$: Subject<void> = new Subject();

  constructor(public store: CheckersStore) {
  }

  ngOnInit() {
    this.store.initState({
      rows: 8,
      columns: 8,
      filledRows: 3,
      firstToken: CheckersPlayerType.BLACK,
      humanPlayers: [CheckersPlayerType.BLACK]
    });
    this.store.state$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(state=>{
          this.possibleMoves = getPossibleMoves(state);
      });
  }

  ngOnDestroy() {
      this.ngUnsubscribe$.next();
      this.ngUnsubscribe$.complete();
  }

  cellClicked(row, column){
    if(!this.store.state.humanPlayers.includes(this.store.state.nextPlayer)){
      return;
    } else if(this.targetCells.find(targetCell=>row===targetCell[0]&& column==targetCell[1])){
      this.store.playMove(this.prepareMove(this.activeCell, [row, column]));
      this.activeCell = undefined;
      this.targetCells = [];
    } else if(this.possibleMoves.some(move=>move.row===row && move.column===column)){
      this.activeCell = [row, column];
      this.targetCells = getPossibleMovesFromLocation(this.store.state, [row, column]).map(this.getMoveTarget);
    }
  }

  prepareMove(origin: number[], destination: any[]): CheckersMove {
    const moveType: CheckersMoveType = Math.abs(origin[0]-destination[0])===1?CheckersMoveType.MOVE:CheckersMoveType.JUMP;
    let moveDirection: CheckersMoveDirection;
    if(destination[0]<origin[0]){
      moveDirection = destination[1]<origin[1] ? CheckersMoveDirection.UP_LEFT:CheckersMoveDirection.UP_RIGHT;
    } else{
      moveDirection = destination[1]<origin[1] ? CheckersMoveDirection.DOWN_LEFT:CheckersMoveDirection.DOWN_RIGHT;
    }

    return {
      row: origin[0],
      column: origin[1],
      direction: moveDirection,
      type: moveType
    };
  }

  getMoveTarget(move: CheckersMove): number[] {
    if(move.type===CheckersMoveType.MOVE){
      return offsetCoords(move.direction, [move.row, move.column]);
    } else{
      return offsetCoords(move.direction, offsetCoords(move.direction, [move.row, move.column]));
    }
  }
}
