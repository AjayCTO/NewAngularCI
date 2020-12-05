import { Component, OnInit } from '@angular/core';
import inputFocus from '../../../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../../../assets/js/lib/_inputClear';
import dropdown from '../../../../../../assets/js/lib/_dropdown';
@Component({
  selector: 'app-restock',
  templateUrl: './restock.component.html',
  styleUrls: ['./restock.component.scss']
})
export class RestockComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.ApplyJsFunction();
  }
  ApplyJsFunction() {
    setTimeout(function () {
      inputClear();
      inputFocus();
      dropdown();
    }, 2000)
  }
}
