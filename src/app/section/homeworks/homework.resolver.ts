import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { Observable, take, map, switchMap, of } from "rxjs";
import { Homework } from "src/app/shared/models/homework.model";
import * as fromGlobal from '../../shared/store/app.reducer';
import * as HomeworkAction from '../management/homework-management/store/homework.action';
import * as CourseAction from '../management/subject-management/store/course.action';

@Injectable({
  providedIn: 'root'
})

export class HomeworkResolverService implements Resolve<Homework[]> {

  constructor(
    private store: Store<fromGlobal.AppState>,
    private actions$: Actions
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Homework[] | Observable<Homework[]> | Promise<Homework[]> {
    return this.store.select('homeworkState').pipe(
      take(1),
      map((hState) => hState.homeworks),
      switchMap((homeworks: Homework[]) => {
        if (homeworks.length === 0) {
          //* then return homeworks from store by called side effect from ngrx/effects module
          this.store.dispatch(new HomeworkAction.FetchApiHomework('LEAST_REMAINING', null));
          return this.actions$.pipe(ofType(HomeworkAction.SET_HOMEWORKS), take(1));
        } else {
          //* return new observable of recipes
          return of(homeworks);
        }
      })
    );
  }
}
