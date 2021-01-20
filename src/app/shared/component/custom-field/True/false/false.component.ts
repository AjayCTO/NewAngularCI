import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-false',
  templateUrl: './false.component.html',
  styleUrls: ['./false.component.css']
})
export class FalseComponent implements OnInit {
  public selectedFieldName: any = []
  constructor() { }

  ngOnInit(): void {
  }
  selectField(index) {
    debugger;
    if (index == "false") {
      this.selectedFieldName.push("false");
    }
  }

}
