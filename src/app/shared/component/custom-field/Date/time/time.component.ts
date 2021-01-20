import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import datePicker from '../../../../../../assets/js/lib/_datePicker';
@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css']
})
export class TimeComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter<any>();
  @Output() RefreshInventory = new EventEmitter();
  public selectedFieldName: any = []
  constructor() { }

  ngOnInit(): void {
    datePicker();
  }
  selectField(index) {
    debugger;

  }

}
