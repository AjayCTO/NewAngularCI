import { Component, Input, OnInit, } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import datePicker from '../../../../assets/js/lib/_datePicker';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
@Component({
  selector: 'app-custom-field',
  templateUrl: './custom-field.component.html',
  styleUrls: ['./custom-field.component.scss']
})
export class CustomFieldComponent implements OnInit {
  public DetailsOpen: boolean
  public selectedFieldName: any = [];
  public Time: boolean
  public Number: boolean
  public False: boolean
  constructor(private toastr: ToastrService) { }

  ngOnInit(): void {
    this.AddJsFunction();
  }
  AddJsFunction() {
    setTimeout(function () {
      datePicker();
      inputClear();
      inputFocus();
    }, 500)
  }
  Text() {
    this.DetailsOpen = true;
    this.Time = false;
    this.Number = false;
    this.False = false;
    this.AddJsFunction();
  }
  Times() {
    this.Time = true;
    this.DetailsOpen = false;
    this.Number = false;
    this.False = false;
    this.AddJsFunction();
  }
  Numbers() {
    this.Number = true;
    this.DetailsOpen = false;
    this.Time = false;
    this.False = false;
    this.AddJsFunction();
  }
  True() {
    this.False = true;
    this.DetailsOpen = false;
    this.Time = false;
    this.Number = false;
    this.AddJsFunction();
  }
  selectField(index) {
    debugger;
    if (index == "text") {
      let IsExist = false;
      this.selectedFieldName.forEach(element => {

        if (element == index) {
          IsExist = true;
        }
      });
      if (!IsExist) {
        this.selectedFieldName.push("text");
      }
      else {
        this.toastr.warning("Already Exist please choose another one");
      }
      this.AddJsFunction();
    }
    if (index == "prefix") {
      let IsExist = false;
      this.selectedFieldName.forEach(element => {

        if (element == index) {
          IsExist = true;
        }
      });
      if (!IsExist) {
        this.selectedFieldName.push("prefix");
      }
      else {
        this.toastr.warning("Already Exist please choose another one");
      }
      this.AddJsFunction();
    }
    if (index == "suffix") {
      let IsExist = false;
      this.selectedFieldName.forEach(element => {

        if (element == index) {
          IsExist = true;
        }
      });
      if (!IsExist) {
        this.selectedFieldName.push("suffix");
      }
      else {
        this.toastr.warning("Already Exist please choose another one");
      }
      this.AddJsFunction();
    }
    if (index == "PrefixPostfix") {
      let IsExist = false;
      this.selectedFieldName.forEach(element => {

        if (element == index) {
          IsExist = true;
        }
      });
      if (!IsExist) {
        this.selectedFieldName.push("PrefixPostfix");
      }
      else {
        this.toastr.warning("Already Exist please choose another one");
      }
      this.AddJsFunction();
    }
    if (index == "Incrementor") {
      let IsExist = false;
      this.selectedFieldName.forEach(element => {

        if (element == index) {
          IsExist = true;
        }
      });
      if (!IsExist) {
        this.selectedFieldName.push("Incrementor");
      }
      else {
        this.toastr.warning("Already Exist please choose another one");
      }
      this.AddJsFunction();
    }
    if (index == "dropdown") {
      let IsExist = false;
      this.selectedFieldName.forEach(element => {

        if (element == index) {
          IsExist = true;
        }
      });
      if (!IsExist) {
        this.selectedFieldName.push("dropdown");
      }
      else {
        this.toastr.warning("Already Exist please choose another one");
      }
      this.AddJsFunction();
    }
    if (index == "false") {
      let IsExist = false;
      this.selectedFieldName.forEach(element => {

        if (element == index) {
          IsExist = true;
        }
      });
      if (!IsExist) {
        this.selectedFieldName.push("false");
      }
      else {
        this.toastr.warning("Already Exist please choose another one");
      }
      this.AddJsFunction();
    }
    if (index == "currency") {
      let IsExist = false;
      this.selectedFieldName.forEach(element => {

        if (element == index) {
          IsExist = true;
        }
      });
      if (!IsExist) {
        this.selectedFieldName.push("currency");
      }
      else {
        this.toastr.warning("Already Exist please choose another one");
      }
      this.AddJsFunction();
    }
    if (index == "number") {
      let IsExist = false;
      this.selectedFieldName.forEach(element => {

        if (element == index) {
          IsExist = true;
        }
      });
      if (!IsExist) {
        this.selectedFieldName.push("number");
      }
      else {
        this.toastr.warning("Already Exist please choose another one");
      }
      this.AddJsFunction();
    }
    if (index == "date") {
      let IsExist = false;
      this.selectedFieldName.forEach(element => {

        if (element == index) {
          IsExist = true;
        }
      });
      if (!IsExist) {
        this.selectedFieldName.push("date");
      }
      else {
        this.toastr.warning("Already Exist please choose another one");
      }

      this.AddJsFunction();
    }
    if (index == "dateandtime") {
      let IsExist = false;
      this.selectedFieldName.forEach(element => {

        if (element == index) {
          IsExist = true;
        }
      });
      if (!IsExist) {
        this.selectedFieldName.push("dateandtime");
      }
      else {
        this.toastr.warning("Already Exist please choose another one");
      }
      this.AddJsFunction();

    }
    if (index == "time") {
      let IsExist = false;
      this.selectedFieldName.forEach(element => {

        if (element == index) {
          IsExist = true;
        }
      });
      if (!IsExist) {
        this.selectedFieldName.push("time");
      }
      else {
        this.toastr.warning("Already Exist please choose another one");
      }
      this.AddJsFunction();

    }

    // if (index = "text") {

    // }
  }
  RemoveColumn(data) {
    this.selectedFieldName.forEach((element, index) => {

      if (element == data) {
        this.selectedFieldName.splice(index, 1);
      }

    });
  }

}
