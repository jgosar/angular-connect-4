import { Connect4CellState } from 'src/app/services/connect-4/types/connect-4-cell-state';
import { Connect4TokenType } from 'src/app/services/connect-4/types/connect-4-token-type';
import { CellCoords } from 'src/app/types/cell-coords';
import { GameStoreState } from 'src/app/generics/game-store.state';

export class Connect4StoreState extends GameStoreState<Connect4TokenType> {
  field: Connect4CellState[][];
  availableCellCombos: { [key in TokenTypes]: CellCoords[][] };
}

type TokenTypes = Connect4TokenType.RED | Connect4TokenType.YELLOW;
