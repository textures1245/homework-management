import { Homework } from 'src/app/shared/models/homework.model';
import { Course } from 'src/app/shared/models/course.model';
import * as HomeworkAction from './homework.action';

export interface State {
  homeworks: Homework[];
  editId: number;
  homeworkEditor: Homework;
  editMode: boolean;
  fetchMode: string;
  courseFilterId: number
}

const initialState = {
  homeworks: [
    // new Homework(
    //   0,
    //   'Homework 1',
    //   'Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis recusandae enim obcaecati culpa vel odit aperiam dignissimos perferendis possimus quo ex vitae voluptatibus soluta vero labore necessitatibus totam, beatae harum!',
    //   new Date('2020-01-01'),
    //   new Date('2022-12-01'),
    //   null,
    //   0,
    //   [
    //     'https://images.unsplash.com/photo-1657299156653-d3c0147ba3ee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    //     'https://images.unsplash.com/photo-1657299141998-2aba7e9bdebb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=698&q=80',
    //   ],
    //   new Course(1, 'ENG212', 'English for Science', 'Mr.Instructor Longonmol')
    // ),
    // new Homework(
    //   1,
    //   'Homework 2',
    //   'Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis recusandae enim obcaecati culpa vel odit aperiam dignissimos perferendis possimus quo ex vitae voluptatibus soluta vero labore necessitatibus totam, beatae harum!',
    //   new Date('2020-01-01'),
    //   new Date('2020-03-01'),
    //   null,
    //   0,
    //   [
    //     'https://images.unsplash.com/photo-1657299156653-d3c0147ba3ee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    //     'https://images.unsplash.com/photo-1657299141998-2aba7e9bdebb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=698&q=80',
    //   ],
    //   new Course(1, 'ENG212', 'English for Science', 'Mr.Instructor Longonmol')
    // ),
  ],
  editId: -1,
  homeworkEditor: null,
  editMode: false,
  fetchMode: 'LEAST_REMAINING',
  courseFilterId: -1
};

export function HomeworkReducer(
  state = initialState,
  action: HomeworkAction.HomeworkActions
) {
  switch (action.type) {
    case HomeworkAction.ADD_HOMEWORK:
      const generateId =
        state.homeworks.length === 0
          ? 0
          : Math.max(...state.homeworks.map((h) => h.h_id)) + 1;
      console.log({ id: generateId, finishedDate: null, ...action.payload });
      return {
        ...state,
        homeworks: [
          ...state.homeworks,
          { h_id: generateId, finishedDate: null, ...action.payload },
        ],
      };
    case HomeworkAction.ON_EDIT_HOMEWORK:
      return {
        ...state,
        editMode: true,
        HomeworkEditor: state.homeworks.find((h, index) => {
          h.h_id === action.payload;
        }),
        editId: action.payload,
      };
    case HomeworkAction.CLEAR_EDIT_STATE:
      return {
        ...state,
        editMode: false,
        homeworkEditor: null,
        editId: -1,
      };
    case HomeworkAction.UPDATE_HOMEWORK:
      const beforeUpdateItem = state.homeworks.find((h, i) => {
        return h.h_id === state.editId;
      });
      const afterUpdatedItem: Homework = {
        ...beforeUpdateItem,
        ...action.payload,
      };
      let updatedHomeworks: Homework[] = [...state.homeworks];
      updatedHomeworks[state.editId - 1] = afterUpdatedItem;
      return {
        ...state,
        homeworks: updatedHomeworks,
      };
    case HomeworkAction.DELETE_HOMEWORK:
      return {
        ...state,
        homeworks: state.homeworks.filter((h) => {
          return h.h_id !== action.payload;
        }),
      };
    case HomeworkAction.FINISHED_HOMEWORK:
      const beforeChangedStatus: Homework = state.homeworks.find((h) => {
        return h.h_id === action.payload;
      });
      const changedIndex = state.homeworks.indexOf(beforeChangedStatus)
      console.log(changedIndex)
      let currentDate = new Date().toJSON().slice(0, 10).replace(/-/g, '-');

      const afterChangedStatus: Homework = {
        ...beforeChangedStatus,
        status: 1,
        finishedDate: new Date(currentDate),
      };
      console.log(afterChangedStatus);
      let updatedHomeworkStatus: Homework[] = [...state.homeworks];
      updatedHomeworkStatus[changedIndex] = afterChangedStatus;
      return {
        ...state,
        homeworks: updatedHomeworkStatus,
      };
    case HomeworkAction.SET_HOMEWORKS:
      // console.log('payload loading', action.payload);
      return {
        ...state,
        homeworks: [...action.payload],
      };
    case HomeworkAction.FETCH_API_HOMEWORK:
      return {
        ...state,
        fetchMode: action.payload == null ? state.fetchMode : action.payload,
        courseFilterId: action.groupFilterId == null ? state.courseFilterId : action.groupFilterId,
        homeworks: [...state.homeworks]
      }
    default:
      return state;
  }
}
