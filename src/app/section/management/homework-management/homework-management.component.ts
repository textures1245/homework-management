import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-homework-management',
  templateUrl: './homework-management.component.html',
  styleUrls: ['./homework-management.component.css']
})
export class HomeworkManagementComponent implements OnInit {
  stepState = 1;
  imagePlaceholder = 'https://www.unfe.org/wp-content/uploads/2019/04/SM-placeholder.png';
  @Input() date = new Date('2020-01-01');
  constructor() {
   }

  ngOnInit(): void {
    console.log(this.date);

  }

  onNextStep() {
    this.stepState++;
    console.log(this.date)
  }

  onPreviousStep() {
    this.stepState--;
  }
}
