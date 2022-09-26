import { Action } from '@ngrx/store';
import { Course } from 'src/app/shared/models/course.model';

export const ADD_COURSE = '[Course] Add Course';

export class AddCourse implements Action {
  readonly type = ADD_COURSE;

  constructor(public payload: Course) {}
}

export type CourseActions = AddCourse;
