import { Component, Input, OnInit } from '@angular/core';
import inputFocus from '../../../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../../../assets/js/lib/_inputClear';
import dropdown from '../../../../../../assets/js/lib/_dropdown';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @Input() locationsList: any;
  @Input() uomList: any;
  @Input() item: any;
  public selectedItem: any;
  public uomLists: any;
  public locationsLists: any;
  tableinfo: FormGroup;
  showtable: boolean;
  public table: any = [];
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    debugger;
    this.locationsLists = this.locationsList;
    this.selectedItem = this.item;
    this.showtable = false;

    this.uomLists = this.uomList;
    this.tableinfo = this.formBuilder.group({
      HowManyQuantity: ['', null],
      Quantity: ['', null],
      DefaultUOM: ['', null],
    });


    setTimeout(function () {

      inputFocus();

    }, 200)
    // this.ApplyJsFunction();
  }
  showintable() {
    debugger;
    this.showtable = true;
    this.table = this.tableinfo.value;
  }

}
