import { Component, OnInit } from '@angular/core';

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
    'Firebase backend for storing data as JSON.',
    'This application is open source and you can contribute to it. You can view the source code on my GitHub.'
  ]
  details = [
    '...'
  ]
  constructor() {}

  ngOnInit(): void {}
  onChangeView(event: string) {
    this.changedDetail = event;
  }
}
