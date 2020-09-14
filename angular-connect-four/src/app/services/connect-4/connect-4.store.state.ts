import { CellState } from 'src/app/types/cell-state';
import { TokenType } from 'src/app/types/token-type';

export class Connect4StoreState {
  field: CellState[][];
  nextToken: TokenType;
  winner: TokenType | undefined;
}
