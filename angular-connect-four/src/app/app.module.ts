import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { Connect4Component } from './views/connect-4/connect-4.component';
import { Connect4Store } from './services/connect-4/connect-4.store';
import { WinnerBannerComponent } from './components/winner-banner.component';
import { Connect4InitGameReducer } from './services/connect-4/reducers/connect-4-init-game-reducer';
import { Connect4PlayMoveReducer } from './services/connect-4/reducers/connect-4-play-move.reducer';
import { LoadGameReducer } from './services/connect-4/reducers/load-game.reducer';
import { Connect4MoveChooserService } from './services/connect-4/move-chooser/connect-4-move-chooser.service';
import { CheckersComponent } from './views/checkers/checkers.component';
import { CheckersMoveChooserService } from './services/checkers/move-chooser/checkers-move-chooser-service';
import { CheckersStore } from './services/checkers/checkers.store';
import { CheckersInitGameReducer } from './services/checkers/reducers/checkers-init-game-reducer';
import { CheckersPlayMoveReducer } from './services/checkers/reducers/checkers-play-move-reducer';

@NgModule({
  declarations: [AppComponent, Connect4Component, CheckersComponent, WinnerBannerComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [Connect4Store, Connect4InitGameReducer, Connect4PlayMoveReducer, LoadGameReducer, Connect4MoveChooserService, CheckersStore, CheckersInitGameReducer, CheckersPlayMoveReducer, CheckersMoveChooserService],
  bootstrap: [AppComponent],
})
export class AppModule {}
