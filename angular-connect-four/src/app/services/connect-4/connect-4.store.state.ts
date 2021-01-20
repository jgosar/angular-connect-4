import { CellState } from 'src/app/types/cell-state';
import { Connect4TokenType } from 'src/app/services/connect-4/types/connect-4-token-type';
import { CellCoords } from 'src/app/types/cell-coords';

export class Connect4StoreState {
  field: CellState[][];
  availableCellCombos: { [key in TokenTypes]: CellCoords[][] };
  nextPlayer: Connect4TokenType;
  winner: Connect4TokenType | undefined;
  humanPlayers: Connect4TokenType[];
}

type TokenTypes = Connect4TokenType.RED | Connect4TokenType.YELLOW;
