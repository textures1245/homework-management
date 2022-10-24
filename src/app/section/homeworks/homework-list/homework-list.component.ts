import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { EMPTY, map, Observable, Subscription, tap } from 'rxjs';
import { Homework } from 'src/app/shared/models/homework.model';
import * as fromApp from '../../../shared/store/app.reducer';
import * as HomeworkAction from '../../management/homework-management/store/homework.action';
import { HomeworkService } from '../homework.service';

@Component({
  selector: 'app-homework-list',
  templateUrl: './homework-list.component.html',
  styleUrls: ['./homework-list.component.css'],
})
export class HomeworkListComponent implements OnInit, OnDestroy {
  homeworks$: Observable<{ homeworks: Homework[] }> = EMPTY;
  homeworks: Homework[] = [];
  _clearObsEmitter$ = Subscription.EMPTY;
  _clearLoadedEmitter$ = Subscription.EMPTY;
  openIndex: number = -1;
  outdateHomework: boolean = false;
  deadlineDayLeft: number = 0;
  toggleFilter = false;
  pageEvent: PageEvent;

  paginationConfig = {
    page: 1,
    count: 0,
    pageSize: 5,
    pageSizeOptions: [1, 5, 10, 15, 20],
  };

  constructor(
    public store: Store<fromApp.AppState>,
    private homeworkService: HomeworkService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new HomeworkAction.ClearEditState());
    this.getHomeworks();
    // this.homeworks$ = this.store.select('homeworkState');

    // this._clearSubjectEmitter$ =
    //   this.homeworkService.loadedHomeworkEmitter$.subscribe((didLoaded) => {
    //     if (didLoaded) {
    //       this.store
    //         .select('homeworkState')
    //         .pipe(map((hState) => hState.homeworks))
    //         .subscribe((homeworks: Homework[]) => {
    //           this.homeworks = homeworks.filter((h) => {
    //             return h.status === 0;
    //           });
    //         });
    //     }
    //   });
  }

  onPageDataChange(event: any) {
    this.pageEvent = event
    this.paginationConfig.page = this.pageEvent.pageIndex + 1;
    this.paginationConfig.pageSize = this.pageEvent.pageSize;
    this.getHomeworks();
  }

  private getHomeworks() {
    this._clearObsEmitter$ = this.store
      .select('homeworkState')
      .pipe(map((hState) => hState.homeworks))
      .subscribe((homeworks: Homework[]) => {
        this.homeworks = homeworks.filter((h) => {
          return h.status === 0 && h.groupWork.g_id == null;
        });
      });
  }

  private onTriggerLoadedHomework() {}

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
    if (this._clearObsEmitter$) {
      this._clearObsEmitter$.unsubscribe();
    }
  }
}
