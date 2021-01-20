import { Component, OnInit } from '@angular/core';
import { CheckersStore } from 'src/app/services/checkers/checkers.store';
import { CheckersTokenType } from 'src/app/services/checkers/types/checkers-token-type';

@Component({
  selector: 'acf-checkers',
  templateUrl: './checkers.component.html',
  styleUrls: ['./checkers.component.less'],
})
export class CheckersComponent implements OnInit {
  constructor(public store: CheckersStore) {}

  ngOnInit() {
    this.store.initState(8, 8, 3, CheckersTokenType.BLACK);
  }
}
