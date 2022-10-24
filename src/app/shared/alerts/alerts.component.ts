import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css'],
})
export class AlertsComponent implements OnInit {
  onAlertCommand = '';
  showAlertTopic = '';
  showAlertDesc = '';
  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.sharedService.alertCommandAction.subscribe((alertCommand) => {
      if (alertCommand.alertCmd !== '') {
        this.onAlertCommand = alertCommand.alertCmd;
        this.showAlertTopic = alertCommand.alertTopic;
        this.showAlertDesc = alertCommand.alertDesc;
      }
      setTimeout(() => {
        this.onAlertCommand = '';
      }, 3500);
    });
  }

  // clickAction() {
  //   setTimeout(() => {
  //     this.onAlertCommand = '';
  //   }, 3000);
  // }
}
