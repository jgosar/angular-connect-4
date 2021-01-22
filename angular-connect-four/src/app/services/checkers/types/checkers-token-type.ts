export enum CheckersTokenType {
  BLACK = 1,
  WHITE = 2,
  BLACK_KING = 3,
  WHITE_KING = 4,
}

export const WHITE_TOKENS: CheckersTokenType[] = [CheckersTokenType.WHITE, CheckersTokenType.WHITE_KING];
export const BLACK_TOKENS: CheckersTokenType[] = [CheckersTokenType.BLACK, CheckersTokenType.BLACK_KING];
export const KING_TOKENS: CheckersTokenType[] = [CheckersTokenType.WHITE_KING, CheckersTokenType.BLACK_KING];
