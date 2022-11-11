import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { EMPTY, map, Subscription } from 'rxjs';
import { Course } from 'src/app/shared/models/course.model';
import { GroupWork } from 'src/app/shared/models/groupWork.model';
import { Homework } from 'src/app/shared/models/homework.model';
import { Teammate } from 'src/app/shared/models/teammate.model';
import { SharedService } from 'src/app/shared/shared.service';
import * as fromGlobal from '../../../shared/store/app.reducer';
import * as HomeworkAction from './store/homework.action';

@Component({
  selector: 'app-homework-management',
  templateUrl: './homework-management.component.html',
  styleUrls: ['./homework-management.component.css'],
})
export class HomeworkManagementComponent implements OnInit, OnDestroy {
  urlValidation =
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
  stepState = 1;
  courses: Course[];
  selectCourse: Course;
  editMode = false;
  idEdit: number = null;
  homeworkEditor: Homework;
  _clearObjectEditor$ = Subscription.EMPTY;
  _clearEditState$ = Subscription.EMPTY;
  formObject: FormGroup;
  imagePlaceholder =
    'https://www.unfe.org/wp-content/uploads/2019/04/SM-placeholder.png';
  // @ViewChild('ngImageForm') imageForm: NgForm
  selectedFile = null;
  justUploadImage = true;
  enableGroupWorkOption = false;

  constructor(
    private store: Store<fromGlobal.AppState>,
    private router: Router,
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private sharedService: SharedService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.store
      .select('courseState')
      .pipe(map((courseState) => courseState.courses))
      .subscribe((courses: Course[]) => {
        this.courses = courses;
      });

    this._clearEditState$ = this.store
      .select('homeworkState')
      .subscribe((state) => {
        if (state.editMode === true) {
          this.editMode = true;
          this.idEdit = state.editId;
        } else {
          this.editMode = false;
        }
      });
    this.initialForm();
    // if (!this.editMode && this.formObject.get('imageUrls').value.length < 1) {
    //   this.onAddNewImageUrl();
    // }

    //* If ImageUrl is valid then loaded images
    // this.formObject.controls['imageUrls'].valueChanges.subscribe(
    //   (loadedImage) => {
    //     if (this.formObject.controls['imageUrls'].invalid) {
    //       this.formObject.get('imageUrls').value.slice(-1).imageUrls = 'https://www.publicdomainpictures.net/pictures/280000/nahled/not-found-image-15383864787lu.jpg'
    //     }
    //   }
    // );

    // this.store.dispatch(new HomeworkAction.ClearEditState());
  }

  onNextStep() {
    this.stepState++;
  }

  onPreviousStep() {
    this.stepState--;
  }

  onSelectCourse(courseIndex: any) {
    this.selectCourse = this.courses.find(
      (c, index) => index == courseIndex.target.value[0] - 1
    );
    if (this.selectCourse !== null) {
      this.course.setValue(this.selectCourse);
    } else {
      this.selectCourse = null;
    }
  }

  onSelectTypeOfWork(status: any) {
    console.log(status.target.value)
    if (status.target.value == 'Group') {
      this.enableGroupWorkOption = true;
    } else {
      this.enableGroupWorkOption = false;
    }
  }

  onSelectPrefix(prefixName: any) {
    this.formObject
      .get('teammate')
      .value['prefixName']?.setValue(prefixName.target.value);
  }

  get course() {
    return this.formObject.get('course');
  }

  get currentDate() {
    return new Date().toJSON().slice(0, 10).replace(/-/g, '-');
  }
  private initialForm() {
    let titleObj = '';
    let descObj = '';
    let deadlineDateObj: Date = null;
    let createdDateObj: Date | string = this.currentDate;
    let statusObj = 0;
    let imageUrlObj = new FormArray([]);
    let courseObj: Course = null;
    let g_id = -1;
    let groupStatus: GroupWork = null;
    let teammateObjArray = new FormArray([]);
    if (this.editMode) {
      this._clearObjectEditor$ = this.store
        .select('homeworkState')
        .pipe(
          map((homeworkState) => {
            return homeworkState.homeworks.find(
              (homework, index) => homework.h_id === this.idEdit
            );
          })
        )
        .subscribe((homework: Homework) => (this.homeworkEditor = homework));
      console.log(this.homeworkEditor);
      titleObj = this.homeworkEditor.title;
      descObj = this.homeworkEditor.description;
      deadlineDateObj = this.homeworkEditor.deadlineDate;
      createdDateObj = this.homeworkEditor.createdDate;
      statusObj = this.homeworkEditor.status;
      courseObj = this.homeworkEditor.course;
      this.selectCourse = this.homeworkEditor.course;
      if (this.homeworkEditor.imageUrls) {
        for (let image of this.homeworkEditor.imageUrls) {
          imageUrlObj.push(
            new FormGroup({
              imageUrls: new FormControl(image, [
                Validators.required,
              ]),
            })
          );
        }
      }
      if (this.homeworkEditor.groupWork.g_id !== null) {
        let teammateObj = this.homeworkEditor.groupWork.teammates;
        for (let i = 0; i < teammateObj.name.length; i++) {
          teammateObjArray.push(
            new FormGroup({
              prefixName: new FormControl(teammateObj.prefixName[i]),
              name: new FormControl(teammateObj.name[i], Validators.required),
              assigned: new FormControl(
                teammateObj.assigned[i],
                Validators.required
              ),
              done_status: new FormControl(teammateObj.done_status[i] ?? 0),
              tm_code: new FormControl(
                teammateObj.tm_code[i],
                Validators.required
              ),
            })
          );
        }
        g_id = this.homeworkEditor.groupWork.g_id;
      }
    }

    this.formObject = new FormGroup({
      title: new FormControl(titleObj, Validators.required),
      description: new FormControl(descObj, Validators.required),
      createdDate: new FormControl(createdDateObj),
      deadlineDate: new FormControl(deadlineDateObj, Validators.required),
      status: new FormControl(statusObj),
      imageUrls: imageUrlObj,
      course: new FormControl(courseObj, Validators.required),
      teammate: teammateObjArray,
    });
  }

  onAddNewImageUrl() {
    (<FormArray>this.formObject.get('imageUrls')).push(
      new FormGroup({
        imageUrls: new FormControl(null, [
          Validators.required,
          Validators.pattern(this.urlValidation),
        ]),
      })
    );
  }

  onAddNewTeammate() {
    (<FormArray>this.formObject.get('teammate')).push(
      new FormGroup({
        prefixName: new FormControl(null, [Validators.required]),
        name: new FormControl(null, Validators.required),
        assigned: new FormControl(null, Validators.required),
        done_status: new FormControl(0),
        tm_code: new FormControl(null, Validators.required),
      })
    );
  }

  compareFunc(c1: Course, c2: Course): boolean {
    return c1 && c2 ? c1.courseId === c2.courseId : c1 === c2;
  }

  onRemoveImageControl(index: number) {
    (<FormArray>this.formObject.get('imageUrls')).removeAt(index);
  }

  // onSubmitImage() {
  //   console.log(this.imageForm.value)
  // }

  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
    console.log(this.selectedFile);
  }

  onUpload() {
    const fd = new FormData();
    fd.append('image', this.selectedFile, this.selectedFile.name);
    this.http.post('http://localhost:3000/upload', fd).subscribe((res) => {
      setTimeout(() => {
        (<FormArray>this.formObject.get('imageUrls')).push(
          new FormGroup({
            imageUrls: new FormControl(res['imagePath'].slice(4), [
              Validators.required,
            ]),
          })
        );
      }, 200);
      this.sharedService.alertCommandAction.next({
        alertCmd: 'ALERT_SUCCESS',
        alertTopic: 'Upload Image Successfully',
        alertDesc: 'Image had been uploaded',
      });
    });
  }

  onSubmit() {
    let tmPrefixName: any[] = [];
    let tmName: any[] = [];
    let tmCode: any[] = [];
    let tmAssigned: any[] = [];
    let tmDoneStatus: any[] = [];
    if (this.enableGroupWorkOption) {
      tmPrefixName = this.formObject.get('teammate').value.map((obj) => {
        return obj.prefixName;
      });
      tmName = this.formObject.get('teammate').value.map((obj) => {
        return obj.name;
      });
      tmCode = this.formObject.get('teammate').value.map((obj) => {
        return obj.tm_code;
      });
      tmAssigned = this.formObject.get('teammate').value.map((obj) => {
        return obj.assigned;
      });
      tmDoneStatus = this.formObject.get('teammate').value.map((obj) => {
        return obj.done_status;
      });
    }

    console.log({
      ...this.formObject.value,
      groupWork: new GroupWork(
        null,
        new Teammate(
          null,
          tmPrefixName,
          tmName,
          tmAssigned,
          tmDoneStatus,
          tmCode
        )
      ),
      imageUrls: this.formObject.get('imageUrls').value.map((obj) => {
        return obj.imageUrls;
      }),
      teammate: null
    });

    if (!this.editMode) {
      if (this.enableGroupWorkOption) {
        this.store.dispatch(
          new HomeworkAction.AddHomework({
            ...this.formObject.value,
            groupWork: new GroupWork(
              null,
              new Teammate(
                null,
                tmPrefixName,
                tmName,
                tmAssigned,
                tmDoneStatus,
                tmCode
              )
            ),
            imageUrls: this.formObject.get('imageUrls').value.map((obj) => {
              return obj.imageUrls;
            }),
            teammate: null
          })
        );
      } else {
        this.store.dispatch(
          new HomeworkAction.AddHomework({
            ...this.formObject.value,
            groupWork: new GroupWork(
              null,
              new Teammate(null, null, null, null, null, null)
            ),
            imageUrls: this.formObject.get('imageUrls').value.map((obj) => {
              return obj.imageUrls;
            }),
            teammate: null
          })
        );
      }

      this.sharedService.alertCommandAction.next({
        alertCmd: 'ALERT_SUCCESS',
        alertTopic: 'Add Successfully',
        alertDesc: 'Your homework had now store in the list',
      });
    } else {
      if (this.enableGroupWorkOption) {
        this.store.dispatch(
          new HomeworkAction.UpdateHomework(
            {
              ...this.formObject.value,
              groupWork: new GroupWork(
                this.homeworkEditor.groupWork.g_id,
                new Teammate(
                  this.homeworkEditor.groupWork.teammates.tm_id,
                  tmPrefixName,
                  tmName,
                  tmAssigned,
                  tmDoneStatus,
                  tmCode
                )
              ),
              imageUrls: this.formObject.get('imageUrls').value.map((obj) => {
                return obj.imageUrls;
              }),
              teammate: null
            },
            this.idEdit
          )
        );
      } else {
        this.store.dispatch(
          new HomeworkAction.UpdateHomework(
            {
              ...this.formObject.value,
              groupWork: new GroupWork(
                null,
                new Teammate(null, null, null, null, null, null)
              ),
              imageUrls: this.formObject.get('imageUrls').value.map((obj) => {
                return obj.imageUrls;
              }),
              teammate: null
            },
            this.idEdit
          )
        );
      }

      this.sharedService.alertCommandAction.next({
        alertCmd: 'ALERT_SUCCESS',
        alertTopic: 'Updated Successfully',
        alertDesc: 'Your homework had now been updated',
      });
    }

    this.store.dispatch(new HomeworkAction.ClearEditState());
    this.router.navigate(['homework-list']);
  }

  get controls() {
    return (<FormArray>this.formObject.get('imageUrls')).controls;
  }

  get teammateControls() {
    return (<FormArray>this.formObject.get('teammate')).controls;
  }

  ngOnDestroy(): void {
    if (this._clearObjectEditor$) {
      this._clearObjectEditor$.unsubscribe();
    }
    if (this._clearObjectEditor$) {
      this._clearEditState$.unsubscribe();
    }
  }
}
