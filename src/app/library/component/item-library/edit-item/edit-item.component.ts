import { Component, OnInit } from '@angular/core';
import inputFocus from '../../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../../assets/js/lib/_inputClear';
import dropdown from '../../../../../assets/js/lib/_dropdown';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {

  DetailsOpen = false;
  SettingsOpen = false;
  RestockOpen = false;
  UsersOpen = false;
  ValuesOpen = false;

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
  Details() {
    this.DetailsOpen = true;
    this.SettingsOpen = false;
    this.RestockOpen = false;
    this.UsersOpen = false;
    this.ValuesOpen = false;
  }
  Settings() {
    this.SettingsOpen = true;
    this.DetailsOpen = false;
    this.RestockOpen = false;
    this.UsersOpen = false;
    this.ValuesOpen = false;
  }
  Restock() {
    this.RestockOpen = true;
    this.DetailsOpen = false;
    this.SettingsOpen = false;
    this.UsersOpen = false;
    this.ValuesOpen = false;
  }
  Users() {
    this.UsersOpen = true;
    this.DetailsOpen = false;
    this.SettingsOpen = false;
    this.RestockOpen = false;
    this.ValuesOpen = false;
  }
  Values() {
    this.ValuesOpen = true;
    this.DetailsOpen = false;
    this.SettingsOpen = false;
    this.RestockOpen = false;
    this.UsersOpen = false;
  }

}
