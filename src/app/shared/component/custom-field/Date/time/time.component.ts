import { Component, OnInit } from '@angular/core';
import datePicker from '../../../../../../assets/js/lib/_datePicker';
@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css']
})
export class TimeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    datePicker();
  }

}
