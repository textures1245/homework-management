import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { EMPTY, Observable } from 'rxjs';
import { Homework } from 'src/app/shared/models/homework.model';
import * as fromApp from '../../../shared/store/app.reducer';

@Component({
  selector: 'app-homework-list',
  templateUrl: './homework-list.component.html',
  styleUrls: ['./homework-list.component.css'],
})
export class HomeworkListComponent implements OnInit {
  homeworks: Observable<{ homeworks: Homework[] }> = EMPTY;
  constructor(public store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.homeworks = this.store.select('homeworkState');
  }
}
