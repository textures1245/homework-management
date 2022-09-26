import { Action } from "@ngrx/store";
import { Homework } from "../../../../shared/models/homework.model";

export const ADD_HOMEWORK = '[Homework] Add Homework';

export class AddHomework implements Action {
  readonly type = ADD_HOMEWORK;

  constructor(public payload: Homework) {}
}

export type HomeworkActions = AddHomework;
