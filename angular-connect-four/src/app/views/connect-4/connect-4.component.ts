import { Component, OnInit } from '@angular/core';
import { Connect4Store } from 'src/app/services/connect-4/connect-4.store';
import { TokenType } from 'src/app/types/token-type';
import { CellState } from 'src/app/types/cell-state';

@Component({
  selector: 'acf-connect-4',
  templateUrl: './connect-4.component.html',
  styleUrls: ['./connect-4.component.less'],
})
export class Connect4Component implements OnInit {
  constructor(public store: Connect4Store) {}

  ngOnInit() {
    this.store.initState(6, 7, 4, TokenType.RED);
  }
}
