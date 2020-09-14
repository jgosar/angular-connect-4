import { CellState } from 'src/app/types/cell-state';
import { TokenType } from 'src/app/types/token-type';
import { CellCoords } from 'src/app/types/cell-coords';

export class Connect4StoreState {
  field: CellState[][];
  connectHowMany: number;
  cellCombos: CellCoords[][];
  nextToken: TokenType;
  winner: TokenType | undefined;
}
