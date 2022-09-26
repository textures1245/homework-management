import { Component, Input, OnInit } from '@angular/core';
import { EMPTY } from 'rxjs';
import { Homework } from 'src/app/shared/models/homework.model';

@Component({
  selector: 'app-homework-detail',
  templateUrl: './homework-detail.component.html',
  styleUrls: ['./homework-detail.component.css'],
})
export class HomeworkDetailComponent implements OnInit {
  @Input() homework: Homework;
  constructor() {}

  ngOnInit(): void {}
}
