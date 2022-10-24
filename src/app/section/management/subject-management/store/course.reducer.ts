import { act } from '@ngrx/effects';
import { Course } from 'src/app/shared/models/course.model';
import * as CourseAction from '../store/course.action';

export interface State {
  courses: Course[];
}

const initialState = {
  courses: [
    // new Course(1, 'ENG212', 'English for Science', 'Mr.Instructor Longonmol'),
    // new Course(1, 'ENG212', 'English for Science', 'Mr.Instructor Longonmol'),
  ],
};

export function CourseReducer(
  state = initialState,
  action: CourseAction.CourseActions
) {
  switch (action.type) {
    case CourseAction.PUT_COURSES:
      const generateId =
        state.courses.length === 0
          ? 0
          : Math.max(...state.courses.map((c) => c.id)) + 1;
      return {
        ...state,
        courses: [...action.payload],
      };
    case CourseAction.ADD_COURSES:
      const generateCId =
      state.courses.length === 0
        ? 0
        : Math.max(...state.courses.map((c) => c.id)) + 1;
        return {
          ...state,
          courses: [...state.courses, {id: generateCId, ...action.payload}]
        }
    case CourseAction.DELETE_COURSE:
      return {
        ...state,
        courses: state.courses.filter((c, index) => {
          return c.id !== action.payload;
        }),
      };
    case CourseAction.SET_COURSES:
      return {
        ...state,
        courses: [...action.payload],
      };
    default:
      return state;
  }
}
