export class GameStoreState<T> {
  nextPlayer: T;
  winner: T | undefined;
  humanPlayers: T[];
}
