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
    this.customField.customFieldSpecialType = "";
    this.DetailsOpen = true;
    this.Time = false;
    this.Number = false;
    this.False = false;
    this.customField.dataType = "Text"
    this.AddJsFunction();
  }
  Times() {
    this.customField.customFieldSpecialType = "";
    this.Time = true;
    this.DetailsOpen = false;
    this.Number = false;
    this.False = false;
    this.customField.dataType = "Date/Time"
    this.AddJsFunction();
  }
  Numbers() {
    this.customField.customFieldSpecialType = "";
    this.Number = true;
    this.DetailsOpen = false;
    this.Time = false;
    this.False = false;
    this.customField.dataType = "Number"
    this.AddJsFunction();
  }
  True() {
    this.customField.customFieldSpecialType = "";
    this.False = true;
    this.DetailsOpen = false;
    this.Time = false;
    this.Number = false;
    this.customField.dataType = "True/False"
    this.AddJsFunction();
  }
  selectField(index) {
    debugger;
    if (index == "text") {
      this.customField.customFieldSpecialType = "OpenField"
      let IsExist = false;
      this.selectedFieldName = [];
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
      this.selectedFieldName = [];
      this.customField.customFieldSpecialType = "Dropdown"


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
      this.selectedFieldName = [];
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
      this.selectedFieldName = [];
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
      this.selectedFieldName = [];
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
      this.selectedFieldName = [];
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
      this.selectedFieldName = [];
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
      this.selectedFieldName = [];
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
  showoffsetdatefields(value) {

    this.customField.offsetDateFields = value;
    if (value == 'false' || value == 'none') {
      this.customField.dateDefaultPlusMinus = "";
      this.customField.dateDefaultNumber = null;
      this.customField.dateDefaulInterval = "";
      if (value == 'none') {
        this.customField.offsetTimeFields = value;
      }
    }
    this.AddJsFunction();
  }


  showoffsettimefields(value) {
    this.customField.offsetTimeFields = value;
    if (value == 'false' || value == 'none') {
      this.customField.timeDefaultPlusMinus = '';
      this.customField.timeNumberOfHours = null;
      this.customField.timeNumberOFMinutes = null;
    }
    this.AddJsFunction();
  }


  onSubmit() {
    debugger;

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
