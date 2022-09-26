import { Course } from "./course.model";

export class Homework {

  constructor(
    public id: number,
    public title: string,
    public description: string,
    public createdDate: Date,
    public deadlineDate: Date,
    public status: string,
    public imageUrl: string[],
    public course: Course
  ) {}

}
