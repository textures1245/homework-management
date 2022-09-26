import { ActionReducerMap } from "@ngrx/store"

import * as fromHomework from "../../section/management/homework-management/store/homework.reducer";
import * as fromCourse from '../../section/management/subject-management/store/course.reducer';

export interface AppState {
  homeworkState: fromHomework.State,
  courseState: fromCourse.State
}

export const reducers: ActionReducerMap<AppState, any> = {
  homeworkState: fromHomework.HomeworkReducer,
  courseState: fromCourse.CourseReducer
}
