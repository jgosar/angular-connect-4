import { CellState } from 'src/app/types/cell-state';
import { TokenType } from 'src/app/types/token-type';
import { CellCoords } from 'src/app/types/cell-coords';

export class Connect4StoreState {
  field: CellState[][];
  availableCellCombos: { [key in TokenTypes]: CellCoords[][] };
  nextToken: TokenType;
  winner: TokenType | undefined;
}

type TokenTypes = TokenType.RED | TokenType.YELLOW;
