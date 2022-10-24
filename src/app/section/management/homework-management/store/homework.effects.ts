import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { Course } from 'src/app/shared/models/course.model';
import { GroupWork } from 'src/app/shared/models/groupWork.model';
import { Homework } from 'src/app/shared/models/homework.model';
import { Teammate } from 'src/app/shared/models/teammate.model';
import * as fromGlobal from '../../../../shared/store/app.reducer';
import * as HomeworkAction from './homework.action';

@Injectable({
  providedIn: 'root',
})
export class HomeworkEffects {
  homeworkApi = 'http://localhost:3000/api/homeworks/';
  fetchApiHomeworks = createEffect(() =>
    this.actions$.pipe(
      ofType<HomeworkAction.FetchApiHomework>(
        HomeworkAction.FETCH_API_HOMEWORK
      ),
      withLatestFrom(this.store.select('homeworkState')),
      switchMap(([fetchMode, hState]) => {
        const reqMode = hState.fetchMode
        const reqGroupCourseId = hState.courseFilterId
        return this.http
          .put<{ message: string; data: any[] }>(this.homeworkApi + reqMode, {c_id: reqGroupCourseId})
          .pipe(
            map((homeworksData) => {
              return homeworksData.data.map((h) => {
                if (h.g_id == null) {
                  return {
                    h_id: h.h_id,
                    title: h.title,
                    description: h.description,
                    createdDate: h.createdDate,
                    deadlineDate: h.deadlineDate,
                    finishedDate: h.finishedDate,
                    status: h.status,
                    imageUrls: h.imageURL,
                    course: new Course(h.c_id, h.courseId, h.courseName, h.i_name),
                    groupWork: new GroupWork(null, new Teammate(null, null, null, null, null, null))
                  };
                } else {
                  return {
                    h_id: h.h_id,
                    title: h.title,
                    description: h.description,
                    createdDate: h.createdDate,
                    deadlineDate: h.deadlineDate,
                    finishedDate: h.finishedDate,
                    status: h.status,
                    imageUrls: h.imageURL,
                    course: new Course(h.c_id, h.courseId, h.courseName, h.i_name),
                    groupWork: new GroupWork(h.g_id, new Teammate(h.tm_id, h.prefix_name,h.tm_name, h.assigned,h.done_status, h.tm_code))
                  }
                }
              });
            }),
            map((homeworks: Homework[]) => {
              return new HomeworkAction.SetHomework(homeworks);
            }),
            catchError((err) => {
              console.log(err);
              return of();
            })
          );
      })
    )
  );

  addHomework = createEffect(() =>
    this.actions$.pipe(
      ofType<HomeworkAction.AddHomework>(HomeworkAction.ADD_HOMEWORK),
      switchMap((hState) => {
        const postHomework = hState.payload;
        return this.http
          .post<{ message: string; data: any }>(this.homeworkApi, postHomework)
          .pipe(
            tap((res) => {
              console.log(res.message);
            }),
            map(() => {
              return new HomeworkAction.FetchApiHomework(null, null);
            }),
            catchError((err) => {
              console.error(err);
              return of();
            })
          );
      })
    )
  );

  deleteHomework = createEffect(() =>
    this.actions$.pipe(
      ofType<HomeworkAction.DeleteHomework>(HomeworkAction.DELETE_HOMEWORK),
      switchMap((deleteId) => {
        return this.http
          .delete<{ message: string }>(this.homeworkApi + deleteId.payload)
          .pipe(
            tap((res) => {
              console.log(res.message);
            }),
            map(() => {
              return new HomeworkAction.FetchApiHomework(null, null);
            }),
            catchError((err) => {
              console.error(err);
              return of();
            })
          );
      })
    )
  );

  updateHomework = createEffect(() =>
    this.actions$.pipe(
      ofType<HomeworkAction.UpdateHomework>(HomeworkAction.UPDATE_HOMEWORK),
      switchMap((hState) => {
        const mergeState = { h_id: hState.idPayload, ...hState.payload };
        return this.http
          .patch<{ message: string; data: any }>(this.homeworkApi, mergeState)
          .pipe(
            tap((res) => {
              console.log(res.message);
            }),
            map(() => {
              return new HomeworkAction.FetchApiHomework(null, null);
            }),
            catchError((err) => {
              console.log(err);
              return of();
            })
          );
      })
    )
  );

  changedFinishedState = createEffect(() =>
    this.actions$.pipe(
      ofType<HomeworkAction.FinishedHomework>(HomeworkAction.FINISHED_HOMEWORK),
      switchMap((changedId) => {
        return this.http
          .put<{ message: string }>(this.homeworkApi, changedId)
          .pipe(
            map(() => {
              return {type: 'DUMMY ACTION'};
            }),
            catchError((err) => {
              console.log(err);
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
