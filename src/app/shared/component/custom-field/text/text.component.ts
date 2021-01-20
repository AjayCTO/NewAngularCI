import { Component, OnInit } from '@angular/core';
import inputFocus from '../../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../../assets/js/lib/_inputClear';
@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css']
})
export class TextComponent implements OnInit {

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
}