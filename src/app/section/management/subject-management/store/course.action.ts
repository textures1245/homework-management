import { Action } from '@ngrx/store';
import { Course } from 'src/app/shared/models/course.model';

export const PUT_COURSES = '[Course] Add Courses';
export const DELETE_COURSE = '[Course] Delete Course';
export const SET_COURSES = '[Course] Set Courses';
export const FETCH_API_COURSES = '[Course] Fetch API Courses';
export const ADD_COURSES = '[Course] Add Course';

export class PutCourse implements Action {
  readonly type = PUT_COURSES;
  constructor(public payload: Course[]) {}
}

export class DeleteCourse implements Action {
  readonly type = DELETE_COURSE;
  constructor(public payload: number) {}
}

export class SetCourse implements Action {
  readonly type = SET_COURSES;

  constructor(public payload: Course[]) {}
}

export class FetchApiCourses implements Action {
  readonly type = FETCH_API_COURSES;
}

export class AddCourses implements Action {
  readonly type = ADD_COURSES;

  constructor(public payload: Course[]) {}
}

export type CourseActions =
  | PutCourse
  | DeleteCourse
  | SetCourse
  | FetchApiCourses
  | AddCourses;
