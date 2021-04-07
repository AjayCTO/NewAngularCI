import { Component, Input, OnInit, } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AttributeFields, CustomFields } from '../../../customfield/models/customfieldmodel';
import { CustomFieldService } from '../../../customfield/service/custom-field.service';
import { AuthService } from '../../../core/auth.service';
import { finalize } from 'rxjs/operators';
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
  public selectedTenantId: number;
  public selectedFieldName: any = [];
  public Time: boolean
  error: string;
  public Number: boolean
  cfdcomboValuesString: string;
  public dropvalue: any = ["red", "green", "blue"]
  public False: boolean
  PreviewtypesDropDown: any = [];
  PreviewtypesAutocomplete: any = [];
  customField: CustomFields = {
    columnId: 0,
    columnName: '',
    columnLabel: '',
    customFieldType: '',
    dataType: '',
    columnValue: '',
    comboBoxValue: '',
    customFieldIsRequired: false,
    customFieldInformation: '',
    customFieldPrefix: '',
    customFieldSuffix: '',
    customFieldIsIncremental: false,
    customFieldBaseValue: 0,
    customFieldIncrementBy: 0,
    customFieldTextMaxLength: 0,
    customFieldDefaultValue: '',
    customFieldNumberMin: 0,
    customFieldNumberMax: 0,
    customFieldNumberDecimalPlaces: 0,
    customFieldTrueLabel: '',
    customFieldFalseLabel: '',
    customFieldSpecialType: '',
    dateDefaultPlusMinus: '',
    dateDefaultNumber: null,
    dateDefaulInterval: '',
    timeDefaultPlusMinus: '',
    timeNumberOfHours: null,
    timeNumberOFMinutes: null,
    offsetDateFields: '',
    offsetTimeFields: '',
  }
  constructor(private toastr: ToastrService, private authService: AuthService, private customfieldservice: CustomFieldService) { }

  ngOnInit(): void {
    this.customField.dataType = "Text"
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
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
    this.customField.dataType = "Text"
    this.AddJsFunction();
  }
  Times() {
    this.Time = true;
    this.DetailsOpen = false;
    this.Number = false;
    this.False = false;
    this.customField.dataType = "Date/Time"
    this.AddJsFunction();
  }
  Numbers() {
    this.Number = true;
    this.DetailsOpen = false;
    this.Time = false;
    this.False = false;
    this.customField.dataType = "Number"
    this.AddJsFunction();
  }
  True() {
    this.False = true;
    this.DetailsOpen = false;
    this.Time = false;
    this.Number = false;
    this.customField.dataType = "True/False"
    this.AddJsFunction();
  }
  selectField(index) {

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
      this.customField.customFieldSpecialType = "OpenField"
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
      this.customField.customFieldSpecialType = "OpenField"
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
      this.customField.customFieldSpecialType = "OpenField"
      this.customField.customFieldSuffix = '12'
      this.customField.customFieldPrefix = '12'
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
      this.customField.customFieldSpecialType = "OpenField"
      this.customField.customFieldIncrementBy = 12
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
      this.customField.customFieldSpecialType = "Dropdown"
      // this.ComboBoxChangeDropDown(this.dropvalue);
      this.customField.comboBoxValue = this.dropvalue;
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
      this.customField.customFieldSpecialType = "CheckBox";
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
      this.customField.customFieldSpecialType = "Currency";
      this.customField.customFieldDefaultValue = '12';
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
      this.customField.customFieldSpecialType = "Number";
      this.customField.customFieldDefaultValue = '12';
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
      this.customField.customFieldSpecialType = "Date";
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
      this.customField.customFieldSpecialType = "Date & Time";
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
      this.customField.customFieldSpecialType = "Time";
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
  ComboBoxChangeDropDown(value) {
    // dropvalue = this.dropvalue
    this.cfdcomboValuesString = "";
    this.PreviewtypesDropDown = value.split("\n");
    this.cfdcomboValuesString = this.PreviewtypesDropDown.reduce((current, value, index) => {
      if (index > 0 && value != '') {
        current += '\n';
      }
      return current + $.trim(value);
    }, '');
  }
  ComboBoxChangeAutocomlete(value) {
    this.cfdcomboValuesString = "";
    this.PreviewtypesAutocomplete = value.split("\n");
    this.cfdcomboValuesString = this.PreviewtypesAutocomplete.reduce((current, value, index) => {
      if (index > 0 && value != '') {
        current += '\n';
      }
      return current + $.trim(value);
    }, '');
  }

  onSubmit() {


    if (this.customField.customFieldSpecialType == "Autocomplete" || this.customField.customFieldSpecialType == "Dropdown") {
      this.customField.comboBoxValue = this.cfdcomboValuesString;
    }
    this.customField.customFieldType = "CustomField";
    // this.spinner.show();
    this.customfieldservice.AddCustomFields(this.customField, this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {

      }))
      .subscribe(
        result => {

          if (result.entity == true) {


            this.toastr.success("Your custom field is Successfully add.");
            this.customField = {
              columnId: 0,
              columnName: '',
              columnLabel: '',
              customFieldType: '',
              dataType: '',
              columnValue: '',
              comboBoxValue: '',
              customFieldIsRequired: false,
              customFieldInformation: '',
              customFieldPrefix: '',
              customFieldSuffix: '',
              customFieldIsIncremental: false,
              customFieldBaseValue: 0,
              customFieldIncrementBy: 0,
              customFieldTextMaxLength: 0,
              customFieldDefaultValue: '',
              customFieldNumberMin: 0,
              customFieldNumberMax: 0,
              customFieldNumberDecimalPlaces: 0,
              customFieldTrueLabel: '',
              customFieldFalseLabel: '',
              customFieldSpecialType: '',
              dateDefaultPlusMinus: '',
              dateDefaultNumber: null,
              dateDefaulInterval: '',
              timeDefaultPlusMinus: '',
              timeNumberOfHours: null,
              timeNumberOFMinutes: null,
              offsetDateFields: '',
              offsetTimeFields: '',
            }

            this.AddJsFunction();
          }
          else {
            this.toastr.warning(result.message);
          }
        },
        error => {
          this.error = error;

        });
  }

}
