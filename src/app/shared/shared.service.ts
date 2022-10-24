import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor() {}

  alertCommandAction = new Subject<{
    alertCmd: string;
    alertTopic: string;
    alertDesc: string;
  }>();
}
