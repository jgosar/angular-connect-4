import { Injectable } from '@angular/core';
import { Connect4StoreState } from './connect-4.store.state';
import { Store } from 'rxjs-observable-store';

@Injectable()
export class Connect4Store extends Store<Connect4StoreState> {
  constructor() {
    super(new Connect4StoreState());
  }
}
