import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { Observable, take, map, switchMap, of } from "rxjs";
import { Course } from "src/app/shared/models/course.model";
import * as fromGlobal from '../../../shared/store/app.reducer';
import * as CourseAction from '../subject-management/store/course.action';

@Injectable({
  providedIn: 'root'
})
export class CourseResolverService implements Resolve<Course[]> {

  constructor(
    private store: Store<fromGlobal.AppState>,
    private actions$: Actions
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Course[] | Observable<Course[]> | Promise<Course[]> {
    return this.store.select('courseState').pipe(
      take(1),
      map((cState) => cState.courses),
      switchMap((course: Course[]) => {
        if (course.length === 0) {
          //* then return homeworks from store by called side effect from ngrx/effects module
          this.store.dispatch(new CourseAction.FetchApiCourses());
          return this.actions$.pipe(ofType(CourseAction.SET_COURSES), take(1));
        } else {
          //* return new observable of recipes
          return of(course);
        }
      })
    );
  }
}
