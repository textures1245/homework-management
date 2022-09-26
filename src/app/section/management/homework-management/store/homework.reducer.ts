import { Homework } from 'src/app/shared/models/homework.model';
import { Course } from 'src/app/shared/models/course.model';
import * as HomeworkAction from './homework.action';

export interface State {
  homeworks: Homework[];
}

const initialState = {
  homeworks: [
    new Homework(
      0,
      'Homework 1',
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis recusandae enim obcaecati culpa vel odit aperiam dignissimos perferendis possimus quo ex vitae voluptatibus soluta vero labore necessitatibus totam, beatae harum!',
      new Date('2020-01-01'),
      new Date('2020-03-01'),
      'Done',
      [
        'https://images.unsplash.com/photo-1657299156653-d3c0147ba3ee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        'https://images.unsplash.com/photo-1657299141998-2aba7e9bdebb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=698&q=80',
      ],
      new Course(1, 'ENG212', 'English for Science', 'Mr.Instructor Longonmol')
    ),
    new Homework(
      0,
      'Homework 2',
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis recusandae enim obcaecati culpa vel odit aperiam dignissimos perferendis possimus quo ex vitae voluptatibus soluta vero labore necessitatibus totam, beatae harum!',
      new Date('2020-01-01'),
      new Date('2020-03-01'),
      'Done',
      [
        'https://images.unsplash.com/photo-1657299156653-d3c0147ba3ee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        'https://images.unsplash.com/photo-1657299141998-2aba7e9bdebb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=698&q=80',
      ],
      new Course(1, 'ENG212', 'English for Science', 'Mr.Instructor Longonmol')
    ),
  ],
};

export function HomeworkReducer(
  state = initialState,
  action: HomeworkAction.HomeworkActions
) {
  switch (action.type) {
    case HomeworkAction.ADD_HOMEWORK:
      return {
        ...state,
        homeworks: [...state.homeworks, action.payload],
      };
    default:
      return state;
  }
}
