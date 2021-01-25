import { ChangeDetectionStrategy, Component } from "@angular/core";
import { GAMES } from "./game-chooser.component.config";

@Component({
  selector: 'acf-game-chooser',
  templateUrl: './game-chooser.component.html',
  styleUrls: ['./game-chooser.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameChooserComponent {
  games = GAMES;
}
