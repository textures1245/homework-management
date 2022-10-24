import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromGlobal from '../../shared/store/app.reducer';
import * as HomeworkAction from '../management/homework-management/store/homework.action';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {
  version = '1.0.0';
  changedDetail = 'about';
  aboutDetail = [
    'Application that helps you managing your homework list',
    'This application used Angular 14 frontend framework.',
    'Maintained state management with NgRx Store.',
    'Used Tailwind CSS framework for styling.',
    'Backend with Node.js and express for framework.',
    'Used MySQL InnoDB Engine for storing SQL Database',
    // 'This application is open source and you can contribute to it. You can view the source code on my GitHub.'
  ]
  details = [
    'Website นี้มีระบบฟังชั้น CRUD ที่สามารถ เพิ่ม, อ่าน, แก้ไข้ หรือ ลบ ได้ทั้งหมด',
  ]
  constructor(
    private store: Store<fromGlobal.AppState>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new HomeworkAction.ClearEditState());
  }
  onChangeView(event: string) {
    this.changedDetail = event;
  }
}
