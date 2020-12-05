import { Component, OnInit } from '@angular/core';
import inputFocus from '../../../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../../../assets/js/lib/_inputClear';
import dropdown from '../../../../../../assets/js/lib/_dropdown';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // this.ApplyJsFunction();
  }
  ApplyJsFunction() {
    setTimeout(function () {
      inputClear();
      inputFocus();
      dropdown();
    }, 2000)
  }
}
