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
import { EMPTY, map, Observable } from 'rxjs';
import { Course } from 'src/app/shared/models/course.model';
import * as fromGlobal from '../../../shared/store/app.reducer';
import * as CourseAction from '../subject-management/store/course.action';

@Component({
  selector: 'app-subject-management',
  templateUrl: './subject-management.component.html',
  styleUrls: ['./subject-management.component.css'],
})
export class SubjectManagementComponent implements OnInit {
  courses$: Observable<{ courses: Course[] }> = EMPTY;
  courses: Course[] = [];
  formCourseGroup: FormGroup;
  constructor(
    public store: Store<fromGlobal.AppState>,
    public fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.courses$ = this.store.select('courseState');
    this.initialForm();
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
    (<FormArray>this.formCourseGroup.get('formCourses')).removeAt(index);
  }

  onSubmit() {
    console.log(this.formCourseGroup.get('formCourses').getRawValue());
    this.store.dispatch(
      new CourseAction.AddCourse({
        ...this.formCourseGroup.get('formCourses').getRawValue(),
      })
    );
    this.store
      .select('courseState')
      .pipe(map((state) => state.courses))
      .subscribe((stateCourse: Course[]) => {
        this.courses = stateCourse;
        console.log(this.courses)
      });
  }
}
