import { Component, OnInit } from '@angular/core';
import { Connect4Store } from 'src/app/services/connect-4/connect-4.store';
import { Connect4TokenType } from 'src/app/services/connect-4/types/connect-4-token-type';

@Component({
  selector: 'acf-connect-4',
  templateUrl: './connect-4.component.html',
  styleUrls: ['./connect-4.component.less'],
})
export class Connect4Component implements OnInit {
  constructor(public store: Connect4Store) {}

  ngOnInit() {
    this.store.initState(6, 7, 4, Connect4TokenType.RED);
  }
}
