import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeworkService {

  constructor() { }

  loadedHomeworkEmitter$ = new Subject<boolean>();
}
