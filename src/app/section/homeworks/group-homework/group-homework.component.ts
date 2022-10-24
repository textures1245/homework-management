import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { Observable, EMPTY, Subscription, map } from 'rxjs';
import { Homework } from 'src/app/shared/models/homework.model';
import * as fromApp from '../../../shared/store/app.reducer';
import * as HomeworkAction from '../../management/homework-management/store/homework.action';

@Component({
  selector: 'app-group-homework',
  templateUrl: './group-homework.component.html',
  styleUrls: ['./group-homework.component.css']
})

export class GroupHomeworkComponent implements OnInit, OnDestroy {
  // finHomeworks$: Observable<{ homeworks: Homework[] }> = EMPTY;
  groupHomeworks: Homework[] = [];
  _clearObsLoader = Subscription.EMPTY;
  openIndex: number = -1;
  outdateHomework = false;
  deadlineDayLeft: number

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

    this.getGroupHomeworks();
  }

  private getGroupHomeworks() {
    this._clearObsLoader = this.store
      .select('homeworkState')
      .pipe(map((hState) => hState.homeworks))
      .subscribe((homeworks: Homework[]) => {
        this.groupHomeworks = homeworks.filter((h) => {
          return h.groupWork.g_id !== null && h.status === 0
        });
      });
  }

  onPageDataChange(event: any) {
    this.pageEvent = event;
    this.paginationConfig.page = this.pageEvent.pageIndex + 1;
    this.paginationConfig.pageSize = this.pageEvent.pageSize;
    this.getGroupHomeworks();
  }

  expandedPanel(index: number) {
    this.openIndex = index;
  }

   //- Time Calc
   getCurrentTime(): number {
    return new Date().getTime() / 1000;
  }

  deadlineHomework(date: Date): boolean {
    if (new Date(date).getTime() / 1000 <= this.getCurrentTime() - 86400) {
      this.outdateHomework = true;
      return true;
    }

    this.deadlineDayLeft = Math.ceil(
      (new Date(date).getTime() / 1000 - this.getCurrentTime()) / 86400
    );
    this.outdateHomework = false;
    return false;
  }


  ngOnDestroy(): void {
    if (this._clearObsLoader) {
      this._clearObsLoader.unsubscribe();
    }
  }
}
