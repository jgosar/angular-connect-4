import { Component, OnInit } from '@angular/core';
import { CheckersStore } from 'src/app/services/checkers/checkers.store';
import { CheckersPlayerType } from 'src/app/services/checkers/types/checkers-player-type';

@Component({
  selector: 'acf-checkers',
  templateUrl: './checkers.component.html',
  styleUrls: ['./checkers.component.less'],
})
export class CheckersComponent implements OnInit {
  constructor(public store: CheckersStore) {}

  ngOnInit() {
    this.store.initState({
      rows: 8,
      columns: 8,
      filledRows: 3,
      firstToken: CheckersPlayerType.BLACK,
      humanPlayers: [CheckersPlayerType.BLACK]
    });
  }
}
