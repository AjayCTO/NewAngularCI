import { Component, Input, OnInit } from '@angular/core';
import inputFocus from '../../../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../../../assets/js/lib/_inputClear';
import dropdown from '../../../../../../assets/js/lib/_dropdown';
@Component({
  selector: 'app-restock',
  templateUrl: './restock.component.html',
  styleUrls: ['./restock.component.scss']
})
export class RestockComponent implements OnInit {
  @Input() item: any;
  @Input() locationsList: any;
  public location: any;
  constructor() { }

  ngOnInit(): void {
    this.location = this.locationsList;
    // this.ApplyJsFunction();
    setTimeout(function () {
      inputClear();
      inputFocus();

    }, 200)

  }

}
