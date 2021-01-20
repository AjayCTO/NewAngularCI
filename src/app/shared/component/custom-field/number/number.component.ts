import { Component, OnInit } from '@angular/core';
import inputFocus from '../../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../../assets/js/lib/_inputClear';

@Component({
  selector: 'app-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.css']
})
export class NumberComponent implements OnInit {
  public selectedFieldName: any = []
  constructor() { }

  ngOnInit(): void {
    this.AddJsFunction();
  }
  AddJsFunction() {
    setTimeout(function () {
      inputClear();
      inputFocus();
    }, 300)
  }
  selectField(index) {
    debugger;
    if (index == "currency") {
      this.selectedFieldName.push("currency");
    }
    if (index == "number") {
      this.selectedFieldName.push("number");
    }

  }
}
