import { Course } from 'src/app/shared/models/course.model';
import * as CourseAction from '../store/course.action';

export interface State {
  courses: Course[];
}

const initialState = {
  courses: [
    new Course(1, 'ENG212', 'English for Science', 'Mr.Instructor Longonmol'),
    // new Course(1, 'ENG212', 'English for Science', 'Mr.Instructor Longonmol'),
  ],
};

export function CourseReducer(
  state = initialState,
  action: CourseAction.CourseActions
) {
  switch (action.type) {
    case CourseAction.ADD_COURSE:
      const generateId =
        state.courses.length === 0
          ? 0
          : Math.max(...state.courses.map((c) => c.id)) + 1;
      return {
        ...state,
        courses: [action.payload],
      };
    default:
      return state;
  }
}
