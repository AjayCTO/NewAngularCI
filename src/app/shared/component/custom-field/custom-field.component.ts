import { Component, OnInit } from '@angular/core';
import datePicker from '../../../../assets/js/lib/_datePicker';
@Component({
  selector: 'app-custom-field',
  templateUrl: './custom-field.component.html',
  styleUrls: ['./custom-field.component.css']
})
export class CustomFieldComponent implements OnInit {
  public DetailsOpen: boolean
  public Time: boolean
  public Number: boolean
  public False: boolean
  constructor() { }

  ngOnInit(): void {
    datePicker();
  }
  Text() {
    this.DetailsOpen = true;
    this.Time = false;
    this.Number = false;
    this.False = false;

  }
  Times() {
    this.Time = true;
    this.DetailsOpen = false;
    this.Number = false;
    this.False = false;

  }
  Numbers() {
    this.Number = true;
    this.DetailsOpen = false;
    this.Time = false;
    this.False = false;

  }
  True() {
    this.False = true;
    this.DetailsOpen = false;
    this.Time = false;
    this.Number = false;

  }

}
