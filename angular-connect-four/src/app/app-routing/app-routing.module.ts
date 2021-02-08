import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Connect4Component } from '../views/connect-4/connect-4.component';
import { CheckersComponent } from '../views/checkers/checkers.component';
import { GameChooserComponent } from '../components/game-chooser/game-chooser.component';

const routes: Routes = [
    {
        path: '',
        component: GameChooserComponent,
    },
    {
        path: 'connect-4',
        redirectTo: 'connect-4/6/7/4'
    },
    {
        path: 'connect-4/:rows/:columns/:connectHowMany',
        component: Connect4Component,
    },
    {
        path: 'checkers',
        redirectTo: 'checkers/8/8/3'
    },
    {
        path: 'checkers/:rows/:columns/:filledRows',
        component: CheckersComponent,
    },
];

@NgModule({
  imports: [
      RouterModule.forRoot(routes)
  ],
  exports: [
      RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
