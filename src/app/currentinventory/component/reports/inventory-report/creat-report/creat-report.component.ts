import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import toggle from '../../../../../../assets/js/lib/_toggle';
import inputFocus from '../../../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../../../assets/js/lib/_inputClear';

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
    this.ApplyJsFunction();
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


  ApplyJsFunction() {
    setTimeout(function () {
      toggle();
      inputClear();
      inputFocus();
      // datePicker();
    }, 2000)
  }
}
