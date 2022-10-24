import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { Observable, EMPTY, Subscription, map } from 'rxjs';
import { Homework } from 'src/app/shared/models/homework.model';
import * as fromApp from '../../../shared/store/app.reducer';
import * as HomeworkAction from '../../management/homework-management/store/homework.action';

@Component({
  selector: 'app-finished-homework-list',
  templateUrl: './finished-homework-list.component.html',
  styleUrls: ['./finished-homework-list.component.css'],
})
export class FinishedHomeworkListComponent implements OnInit, OnDestroy {
  // finHomeworks$: Observable<{ homeworks: Homework[] }> = EMPTY;
  finHomeworks: Homework[] = [];
  _clearObsLoader = Subscription.EMPTY;
  openIndex: number = -1;

  pageEvent: PageEvent;
  paginationConfig = {
    page: 1,
    count: 0,
    pageSize: 5,
    pageSizeOptions: [1, 5, 10, 15, 20],
  };

  constructor(
    public store: Store<fromApp.AppState> // private homeworkService: HomeworkService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new HomeworkAction.ClearEditState());

    this.getFinHomeworks();
  }

  private getFinHomeworks() {
    this._clearObsLoader = this.store
      .select('homeworkState')
      .pipe(map((hState) => hState.homeworks))
      .subscribe((homeworks: Homework[]) => {
        this.finHomeworks = homeworks.filter((h) => {
          return h.status === 1;
        });
      });
  }

  onPageDataChange(event: any) {
    this.pageEvent = event;
    this.paginationConfig.page = this.pageEvent.pageIndex + 1;
    this.paginationConfig.pageSize = this.pageEvent.pageSize;
    this.getFinHomeworks();
  }

  expandedPanel(index: number) {
    this.openIndex = index;
  }

  ngOnDestroy(): void {
    if (this._clearObsLoader) {
      this._clearObsLoader.unsubscribe();
    }
  }
}
