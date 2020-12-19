import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-creat-report',
  templateUrl: './creat-report.component.html',
  styleUrls: ['./creat-report.component.scss']
})
export class CreatReportComponent implements OnInit {

  @Output() hideClose = new EventEmitter();
  public OpenAdvanced = false;

  constructor() { }

  ngOnInit(): void {
  }
  Close() {
    this.hideClose.emit(false);
  }
  showAdvanced() {
    this.OpenAdvanced = true;
  }
  CloseAdvanced() {
    this.OpenAdvanced = false;
  }
}
