import { Course } from "./course.model";
import { GroupWork } from "./groupWork.model";

export class Homework {

  constructor(
    public h_id: number,
    public title: string,
    public description: string,
    public createdDate: Date,
    public deadlineDate: Date,
    public finishedDate: Date | null,
    public status: number,
    public imageUrls: string[],
    public course: Course,
    public groupWork: GroupWork
  ) {}

}
