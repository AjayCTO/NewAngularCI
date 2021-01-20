import { Component, OnInit } from '@angular/core';
import inputFocus from '../../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../../assets/js/lib/_inputClear';
@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css']
})
export class TextComponent implements OnInit {
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
    if (index == "text") {
      this.selectedFieldName.push("text");
    }
    if (index == "prefix") {
      this.selectedFieldName.push("prefix");
    }
    if (index == "suffix") {
      this.selectedFieldName.push("suffix");
    }
    if (index == "PrefixPostfix") {
      this.selectedFieldName.push("PrefixPostfix");
    }
    if (index == "Incrementor") {
      this.selectedFieldName.push("Incrementor");
    }
    if (index == "dropdown") {
      this.selectedFieldName.push("dropdown");
    }
    // if (index = "text") {

    // }
  }
}