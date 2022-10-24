import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import * as fromGlobal from '../../../shared/store/app.reducer';
import * as HomeworkAction from '../../management/homework-management/store/homework.action';

@Component({
  selector: 'app-filter-menu',
  templateUrl: './filter-menu.component.html',
  styleUrls: ['./filter-menu.component.css'],
})
export class FilterMenuComponent implements OnInit, OnDestroy {
  toggleSortFilter = false;
  toggleGroupFilter = false;
  sortSelectedMode = '';
  modeName = '';
  _clearSub$ = Subscription.EMPTY;
  _clearCourse$ = Subscription.EMPTY;

  coursesGroup = [{ c_id: -1, courseCode: '' }];
  courseGroupSelectName: string = 'All';
  courseGroupSelectId: number;
  constructor(private store: Store<fromGlobal.AppState>) {}

  ngOnInit(): void {
    this._clearCourse$ = this.store
      .select('courseState')
      .pipe(map((cState) => cState.courses))
      .subscribe((course) => {
        this.coursesGroup = course.map((c) => {
          return {
            c_id: c.id,
            courseCode: c.courseId,
          };
        });
      });

    this._clearSub$ = this.store.select('homeworkState').subscribe((hState) => {
      this.sortSelectedMode = hState.fetchMode;
      switch (this.sortSelectedMode) {
        case 'LEAST_REMAINING':
          this.modeName = `Least Remaining`;
          break;
        case 'NEWEST_CREATED':
          this.modeName = 'Newest Created';
          break;
        case 'MOST_REMAINING':
          this.modeName = `Most Remaining`;
          break;
        case 'OLDEST_CREATED':
          this.modeName = `Oldest Created`;
          break;
        default:
          this.modeName = `Least Remaining`;
      }

      this.courseGroupSelectId = hState.courseFilterId;
      if (this.courseGroupSelectId !== -1) {
        let cSelected = this.coursesGroup.find((c) => c.c_id === this.courseGroupSelectId)
        this.courseGroupSelectName = cSelected.courseCode
      }
    });
  }

  onSelectedCourseGroup(c_id: number, name: string) {
    this.courseGroupSelectId = c_id;
    this.courseGroupSelectName = name;
    this.store.dispatch(
      new HomeworkAction.FetchApiHomework(
        this.sortSelectedMode,
        this.courseGroupSelectId
      )
    );
  }

  onChangedSortMode(mode: string, name: string) {
    this.sortSelectedMode = mode;
    this.modeName = name;
    this.store.dispatch(
      new HomeworkAction.FetchApiHomework(
        this.sortSelectedMode,
        this.courseGroupSelectId
      )
    );
  }

  ngOnDestroy(): void {
    if (this._clearSub$) {
      this._clearSub$.unsubscribe();
    }
    if (this._clearCourse$) {
      this._clearCourse$.unsubscribe();
    }
  }
}
