import { Action } from '@ngrx/store';
import { Homework } from '../../../../shared/models/homework.model';

export const ADD_HOMEWORK = '[Homework] Add Homework';
export const ON_EDIT_HOMEWORK = '[Homework] On Edit Homework';
export const CLEAR_EDIT_STATE = '[Homework] Clear Edit State';
export const UPDATE_HOMEWORK = '[Homework] Update Homework';
export const DELETE_HOMEWORK = '[Homework] Delete Homework';
export const FINISHED_HOMEWORK = '[Homework] Finished Homework';
export const SET_HOMEWORKS = '[Homework] Set Homework';
export const FETCH_API_HOMEWORK = '[Homework] Fetch Api Homework';

export class AddHomework implements Action {
  readonly type = ADD_HOMEWORK;

  constructor(public payload: Homework) {}
}

export class OnEditHomework implements Action {
  readonly type = ON_EDIT_HOMEWORK;

  constructor(public payload: number) {}
}

export class ClearEditState implements Action {
  readonly type = CLEAR_EDIT_STATE;

  constructor() {}
}

export class UpdateHomework implements Action {
  readonly type = UPDATE_HOMEWORK;

  constructor(public payload: Homework, public idPayload: number) {}
}

export class DeleteHomework implements Action {
  readonly type = DELETE_HOMEWORK;

  constructor(public payload: number) {}
}

export class FinishedHomework implements Action {
  readonly type = FINISHED_HOMEWORK;

  constructor(public payload: number) {}
}

export class SetHomework implements Action {
  readonly type = SET_HOMEWORKS;

  constructor(public payload: Homework[]) {}
}

export class FetchApiHomework implements Action {
  readonly type = FETCH_API_HOMEWORK;

  constructor(public payload: string | null, public groupFilterId: number | null){}
}

export type HomeworkActions =
  | AddHomework
  | OnEditHomework
  | ClearEditState
  | UpdateHomework
  | DeleteHomework
  | FinishedHomework
  | SetHomework
  | FetchApiHomework;
