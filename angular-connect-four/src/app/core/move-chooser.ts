import { findMax, sum } from "../helpers/array.helpers";
import { isDefined, range } from "../helpers/common.helpers";
import { Connect4StoreState } from "../services/connect-4/connect-4.store.state";
import { DropTokenReducer } from "../services/connect-4/reducers/drop-token.reducer";
import { CellCoords } from "../types/cell-coords";
import { CellState } from "../types/cell-state";
import { MoveScore } from "../types/move-rating";
import { TokenType } from "../types/token-type";
import { PREDICTION_DEPTHS_FOR_POSSIBLE_MOVES } from "./combo-calculator.config";
import { canDropToken, getOtherTokenType, getWinner } from "./common-utils";

export function getBestMove(state: Connect4StoreState, predictionDepth?: number): MoveScore {
  if(!isDefined(predictionDepth)){
    const possibleMovesCount: number = getPossibleMoves(state).length;
    predictionDepth = PREDICTION_DEPTHS_FOR_POSSIBLE_MOVES[possibleMovesCount];
  }

  const moveScores: MoveScore[] = getPossibleMoves(state).map((move) => ({
    move,
    score: getMoveScore(state, predictionDepth, move),
  }));
  return findMax(moveScores, (moveScore) => moveScore.score);
}

function getPossibleMoves(state: Connect4StoreState): number[] {
    if (getWinner(state) !== undefined) {
      return [];
    }
    return range(0, state.field[0].length).filter((column) => canDropToken(state.field, column));
  }

function getMoveScore(state: Connect4StoreState, levels: number, move: number) {
  const dropTokenReducer: DropTokenReducer = new DropTokenReducer();
  const nextState: Connect4StoreState = dropTokenReducer.reduce(state, {columnIndex: move});
  if (levels === 0 || getWinner(nextState) !== undefined) {
    return getScore(state.nextToken, nextState);
  } else {
    const bestOpponentsMove: MoveScore = getBestMove(nextState, levels - 1);
    if (bestOpponentsMove === undefined) {
      // No moves are possible because the game is full
      return getScore(state.nextToken, nextState);
    }
    return -bestOpponentsMove.score;
  }
}

function getScore(player: TokenType, state: Connect4StoreState) {
  const playerCombos: CellCoords[][] = state.availableCellCombos[player];
  const playerScore: number = sum(
    playerCombos.map((cellCombo) => getScoreForCombo(player, state.field, cellCombo))
  );
  const opponent: TokenType = getOtherTokenType(player);
  const opponentCombos: CellCoords[][] = state.availableCellCombos[opponent];
  const opponentScore: number = sum(
    opponentCombos.map((cellCombo) => getScoreForCombo(opponent, state.field, cellCombo))
  );

  return playerScore - opponentScore;
}

function getScoreForCombo(playersToken: TokenType, field: CellState[][], cellCombo: CellCoords[]): number {
  const isComboVertical: boolean = cellCombo[0].column == cellCombo[1].column;
  let score: number;
  const cellStatesInCombo: CellState[] = cellCombo.map((cellCoords) => field[cellCoords.row][cellCoords.column]);
  if (cellStatesInCombo.some((cellState) => cellState !== 0 && cellState !== playersToken)) {
    score = 0;
  } else if (cellStatesInCombo.every((cellState) => cellState === playersToken)) {
    score = 10000000;
  } else {
    const playerTokensCount: number = cellStatesInCombo.filter((cellState) => cellState === playersToken).length;
    score = Math.pow(10, playerTokensCount);
  }

  if (isComboVertical) {
    // Vertical combos are trivial to block, so they shouldn't get a very large score
    score /= 5;
  }

  return score;
}
