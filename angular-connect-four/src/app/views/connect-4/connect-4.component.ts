import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Connect4Store } from 'src/app/services/connect-4/connect-4.store';
import { Connect4TokenType } from 'src/app/services/connect-4/types/connect-4-token-type';

@Component({
  selector: 'acf-connect-4',
  templateUrl: './connect-4.component.html',
  styleUrls: ['./connect-4.component.less'],
})
export class Connect4Component implements OnInit, OnDestroy {
  private ngUnsubscribe$: Subject<void> = new Subject();

  constructor(public store: Connect4Store, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(params => {
      this.store.initState({
        rows: parseInt(params['rows']),
        columns: parseInt(params['columns']),
        connectHowMany: parseInt(params['connectHowMany']),
        firstToken: Connect4TokenType.RED,
        humanPlayers: [Connect4TokenType.RED]
      });
    });
  }

  ngOnDestroy(){
      this.ngUnsubscribe$.next();
      this.ngUnsubscribe$.complete();
  }
}
