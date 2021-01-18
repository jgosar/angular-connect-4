import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { Connect4Component } from './views/connect-4/connect-4.component';
import { Connect4Store } from './services/connect-4/connect-4.store';
import { WinnerBannerComponent } from './components/winner-banner.component';
import { InitGameReducer } from './services/connect-4/reducers/init-game-reducer';
import { DropTokenReducer } from './services/connect-4/reducers/drop-token.reducer';
import { LoadGameReducer } from './services/connect-4/reducers/load-game.reducer';
import { MoveChooserService } from './services/move-chooser/move-chooser.service';
import { CloudMoveChooserService } from './services/cloud-move-chooser/cloud-move-chooser.service';

@NgModule({
  declarations: [AppComponent, Connect4Component, WinnerBannerComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [Connect4Store, InitGameReducer, DropTokenReducer, LoadGameReducer, MoveChooserService, CloudMoveChooserService],
  bootstrap: [AppComponent],
})
export class AppModule {}
