import { Component } from '@angular/core';
import { Connect4Store } from 'src/app/services/connect-4/connect-4.store';

@Component({
  selector: 'acf-connect-4',
  templateUrl: './connect-4.component.html',
  styleUrls: ['./connect-4.component.less'],
})
export class Connect4Component {
  constructor(public store: Connect4Store) {}
}
