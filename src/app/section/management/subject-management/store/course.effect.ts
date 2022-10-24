import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { act, Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { Course } from 'src/app/shared/models/course.model';
import * as fromGlobal from '../../../../shared/store/app.reducer';
import * as CourseAction from './course.action';

@Injectable({
  providedIn: 'root',
})
export class CourseEffect {
  apiCourses = 'http://localhost:3000/api/courses/';

  fetchApiCourses = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseAction.FETCH_API_COURSES),
      switchMap((fetchApi) => {
        return this.http
          .get<{ message: string; courses: any[] }>(this.apiCourses)
          .pipe(
            map((cData) => {
              return cData.courses.map((c) => {
                return { ...c };
              });
            }),
            map((course) => {
              return new CourseAction.SetCourse(course);
            }),
            catchError((err) => {
              console.error(err);
              return of();
            })
          );
      })
    )
  );

  postApiCourses = createEffect(() => {
    return this.actions$.pipe(
      ofType<CourseAction.AddCourses>(CourseAction.ADD_COURSES),
      withLatestFrom(this.store.select('courseState')),
      switchMap(([action, cState]) => {
        const coursePosts = action.payload
        console.log(coursePosts)
        return this.http
          .post<{ message: string; courseJson: any }>(this.apiCourses, coursePosts)
          .pipe(
            tap((res) => {
              console.log(res.message, res.courseJson);
            }),
            map(() => {
              return new CourseAction.FetchApiCourses();
            }),
            catchError((err) => {
              console.error(err);
              return of();
            })
          );
      })
    );
  });

  // postApiCourses = createEffect(() => {
  //   let courses: Course[] = [];
  //   this.store.select('courseState').subscribe((cState) => {
  //     courses = cState.courses;
  //   });
  //   return this.actions$.pipe(
  //     ofType(CourseAction.PUT_COURSES),
  //     switchMap((putApi) => {
  //       return this.http
  //         .post<{ message: string; courseJson: any[] }>(this.apiCourses, courses)
  //         .pipe(
  //           tap((res) => {
  //             console.log(res.message);
  //           }),
  //           map(() => {
  //             return new CourseAction.FetchApiCourses();
  //           }),
  //           catchError((err) => {
  //             console.error(err);
  //             return of();
  //           })
  //         );
  //     })
  //   );
  // });

  deleteCourseRecord = createEffect(() =>
    this.actions$.pipe(
      ofType<CourseAction.DeleteCourse>(CourseAction.DELETE_COURSE),
      switchMap((action) => {
        return this.http
          .delete<{ message: string }>(this.apiCourses + action.payload)
          .pipe(
            tap((res) => {
              console.log(res.message);
            }),
            map((courses) => {
              return this.store.select('courseState').subscribe((cState) => {
                return cState.courses.filter((c, i) => {
                  return c.id !== action.payload
                })
              })
            }),
            map(() => {
              return new CourseAction.FetchApiCourses();
            }),
            catchError((err) => {
              console.error(err);
              return of();
            })
          );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromGlobal.AppState>
  ) {}
}
