import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { EMPTY, Subscription } from 'rxjs';
import { Homework } from 'src/app/shared/models/homework.model';
import * as fromGlobal from '../../../shared/store/app.reducer';
import * as HomeworkAction from '../../management/homework-management/store/homework.action';
import { HomeworkService } from '../homework.service';
import * as confetti from 'canvas-confetti';
import { SharedService } from 'src/app/shared/shared.service';

export class TeammateRecordsSchema {
  constructor(
    public prefixName: string,
    public name: string,
    public tm_code: string,
    public assigned: string
  ) {}
}

@Component({
  selector: 'app-homework-detail',
  templateUrl: './homework-detail.component.html',
  styleUrls: ['./homework-detail.component.css'],
})
export class HomeworkDetailComponent implements OnInit, OnDestroy {
  @Input() homework: Homework;
  _clearNavigatedEditor = Subscription.EMPTY;
  @ViewChild('container') container: ElementRef<HTMLDivElement>;
  finishedStatusClicked = false;
  displayedColumns: string[] = ['prefix', 'name', 'code', 'assigned'];
  teammateRecordsSchema: TeammateRecordsSchema[] = [];

  constructor(
    private store: Store<fromGlobal.AppState>,
    private router: Router,
    private homeworkService: HomeworkService,
    private renderer2: Renderer2,
    private elementRef: ElementRef,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    if (this.homework.groupWork.g_id !== null) {
      this.setTeammateRecords();
    }
  }

  onNavigatedToEditMode(homeworkId: number) {
    this.store.dispatch(new HomeworkAction.OnEditHomework(homeworkId));
    this.router.navigate(['/homework-management', homeworkId]);
  }

  onDeleteHomework(homeworkId: number) {
    this.store.dispatch(new HomeworkAction.DeleteHomework(homeworkId));
    this.sharedService.alertCommandAction.next({
      alertCmd: 'ALERT_SUCCESS',
      alertTopic: 'Delete Homework Successfully',
      alertDesc: `Homework had been delete from the list.`
    })
    // this.router.navigate(['/homework-list']);
  }

  onFinishedHomework(homeworkId: number) {
    this.sharedService.alertCommandAction.next({
      alertCmd: 'ALERT_SUCCESS',
      alertTopic: 'Homework Complete',
      alertDesc: 'Congrats, your homework had now send back to finished list!',
    });
    setTimeout(() => {
      this.store.dispatch(new HomeworkAction.FinishedHomework(homeworkId));
    }, 3000);
    // this.router.navigate(['/homework-list']);
  }

  setTeammateRecords() {
    let teammate = this.homework.groupWork.teammates;
    for (let i = 0; i < teammate.name.length; i++) {
      this.teammateRecordsSchema.push(
        new TeammateRecordsSchema(
          teammate.prefixName[i],
          teammate.name[i],
          teammate.tm_code[i],
          teammate.assigned[i]
        )
      );
    }
  }

  public confettiWhenFinished(): void {
    const canvas = this.renderer2.createElement('canvas');
    this.renderer2.appendChild(this.container.nativeElement, canvas);

    const confettiConfig = confetti.create(canvas, {
      resize: true,
    });

    confettiConfig({
      spread: 250,
      particleCount: 120,
    });

    setTimeout(() => {
      this.renderer2.removeChild(this.container.nativeElement, canvas);
      confettiConfig.reset();
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this._clearNavigatedEditor) {
      this._clearNavigatedEditor.unsubscribe();
    }
  }
}
