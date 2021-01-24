import { Component, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CheckersPlayerType } from '../services/checkers/types/checkers-player-type';
import { Connect4TokenType } from '../services/connect-4/types/connect-4-token-type';

@Component({
  selector: 'acf-winner-banner',
  templateUrl: './winner-banner.component.html',
  styleUrls: ['./winner-banner.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WinnerBannerComponent implements OnChanges {
  @Input()
  game: 'Connect4' | 'Checkers';
  @Input()
  winner: Connect4TokenType | CheckersPlayerType | undefined;

  winnerName: string;
  winnerClass: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.winner !== undefined) {
      this.winnerName = this.game === 'Connect4' ? (this.winner === Connect4TokenType.RED ? 'Red' : 'Yellow') : (this.winner === CheckersPlayerType.WHITE ? 'White' : 'Black');
      this.winnerClass = { ['acf-winner-banner__banner--' + this.winnerName.toLowerCase()]: true };
    }
  }
}
