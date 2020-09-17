import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Connect4Component } from './views/connect-4/connect-4.component';
import { Connect4Store } from './services/connect-4/connect-4.store';
import { WinnerBannerComponent } from './components/winner-banner.component';

@NgModule({
  declarations: [AppComponent, Connect4Component, WinnerBannerComponent],
  imports: [BrowserModule],
  providers: [Connect4Store],
  bootstrap: [AppComponent],
})
export class AppModule {}
