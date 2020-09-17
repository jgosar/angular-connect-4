import { Component, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TokenType } from '../types/token-type';

@Component({
  selector: 'acf-winner-banner',
  templateUrl: './winner-banner.component.html',
  styleUrls: ['./winner-banner.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WinnerBannerComponent implements OnChanges {
  @Input()
  winner: TokenType | undefined;

  winnerName: string;
  winnerClass: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.winner !== undefined) {
      this.winnerName = this.winner === TokenType.RED ? 'Red' : 'Yellow';
      this.winnerClass = { ['acf-winner-banner__banner--' + this.winnerName.toLowerCase()]: true };
    }
  }
}
