import { state } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { EMPTY, map, Observable, Subscription } from 'rxjs';
import { Course } from 'src/app/shared/models/course.model';
import * as fromGlobal from '../../../shared/store/app.reducer';
import * as CourseAction from '../subject-management/store/course.action';
import * as HomeworkAction from '../homework-management/store/homework.action';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-subject-management',
  templateUrl: './subject-management.component.html',
  styleUrls: ['./subject-management.component.css'],
})
export class SubjectManagementComponent implements OnInit {
  courses$: Observable<{ courses: Course[] }> = EMPTY;
  courses: Course[] = [];
  formCourseGroup: FormGroup;
  editMode = false;
  controlsLength: number = 0;
  _clearHomeworkChecker$ = Subscription.EMPTY;

  constructor(
    public store: Store<fromGlobal.AppState>,
    public fb: FormBuilder,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new HomeworkAction.ClearEditState());

    this.courses$ = this.store.select('courseState');
    this.initialForm();

    this.controlsLength = (<FormArray>(
      this.formCourseGroup.get('formCourses')
    )).controls.length;
  }

  private initialForm() {
    let course_id = '';
    let course_name = '';
    let instructor = '';
    let formCourses = new FormArray([]);

    this.store
      .select('courseState')
      .pipe(map((state) => state.courses))
      .subscribe((stateCourse: Course[]) => {
        this.courses = stateCourse;
      });

    if (this.courses.length > 0) {
      // this.formCourse = this.fb.group({
      //   courseId: this.fb.array(
      //     this.courses.map(
      //       (courseId) => new FormControl(courseId, Validators.required)
      //     )
      //   ),
      //   courseName: this.fb.array(
      //     this.courses.map(
      //       (courseName) => new FormControl(courseName, Validators.required)
      //     )
      //   ),
      //   instructors: this.fb.array(
      //     this.courses.map(
      //       (instructor) => new FormControl(instructor, Validators.required)
      //     )
      //   ),
      // });
      formCourses = new FormArray(
        this.courses.map((course) => {
          return new FormGroup({
            courseId: new FormControl(course.courseId, Validators.required),
            courseName: new FormControl(course.courseName, Validators.required),
            instructor: new FormControl(course.instructor, Validators.required),
          });
        })
      );
    }
    this.formCourseGroup = new FormGroup({
      formCourses: formCourses,
    });
  }

  get controls() {
    this.controlsLength++;
    return (<FormArray>this.formCourseGroup.get('formCourses')).controls;
  }

  onAddNewCourse() {
    (<FormArray>this.formCourseGroup.get('formCourses')).push(
      new FormGroup({
        courseId: new FormControl(null, Validators.required),
        courseName: new FormControl(null, Validators.required),
        instructor: new FormControl(null, Validators.required),
      })
    );
  }

  onRemoveCourse(index: number) {
    const course = this.courses.find((c, i) => {
      return i === index;
    });

    let preventDelete = false;
    if (course) {
      this._clearHomeworkChecker$ = this.store
        .select('homeworkState')
        .pipe(map((hState) => hState.homeworks))
        .subscribe((h) => {
          h.map((h, i) => {
            if (h.course.courseId === course.courseId) {
              preventDelete = true;
              this.sharedService.alertCommandAction.next({
                alertCmd: 'ALERT_WARNING',
                alertTopic: 'Prevent Deleted',
                alertDesc:
                  "Please delete course's host before remove this course",
              });
            }
          });
        });
    }

    if (!preventDelete) {
      (<FormArray>this.formCourseGroup.get('formCourses')).removeAt(index);
    }
    if (course && !preventDelete) {
      this.store.dispatch(new CourseAction.DeleteCourse(course.id));
      this.sharedService.alertCommandAction.next({
        alertCmd: 'ALERT_SUCCESS',
        alertTopic: `Deleted Course Successfully`,
        alertDesc: `Course's code ${course.courseId} had been removed from course list`,
      });
    }
  }

  onEditMode() {
    this.editMode = true;
  }

  onSubmit() {
    let courseValue = this.formCourseGroup.get('formCourses').value;
    let addNewCourses = courseValue.slice(this.courses.length);
    if (addNewCourses.length > 0) {
      this.store.dispatch(new CourseAction.AddCourses(addNewCourses));
      this.sharedService.alertCommandAction.next({
        alertCmd: 'ALERT_SUCCESS',
        alertTopic: 'Add Course Successfully',
        alertDesc: 'New courses had been now added to the list',
      });
    }
  }

  ngOnDestroy(): void {
    if (this._clearHomeworkChecker$) {
      this._clearHomeworkChecker$.unsubscribe();
    }
  }
}
