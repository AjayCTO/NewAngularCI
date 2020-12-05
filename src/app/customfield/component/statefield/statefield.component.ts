import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { StateFields } from '../../models/customfieldmodel';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../core/auth.service';
import { finalize } from 'rxjs/operators';
import { CustomFieldService } from '../../service/custom-field.service';
import { ToastrService } from 'ngx-toastr';
import modal from '../../../../assets/js/lib/_modal';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
@Component({
  selector: 'app-statefield',
  templateUrl: './statefield.component.html',
  styleUrls: ['./statefield.component.scss']
})
export class StatefieldComponent implements OnInit {
  constructor(private authService: AuthService, private toaster: ToastrService, private spinner: NgxSpinnerService, private customfieldservice: CustomFieldService) { }
  public addState: boolean;
  public selectedTenantId: number;
  busy: boolean;
  error: string;
  CustomFields: any;
  EditMode: boolean = false;
  InputtypeNumber: any = ['Number', 'Currency']
  InputtypeDate: any = ['Date', 'Date & Time', 'Time']
  Inputtypes: any = ['OpenField', 'Dropdown', 'Autocomplete']
  public showForm: boolean;
  public showForm1: boolean;
  public showForm2: boolean;
  public isActive: boolean;
  SelectedEditColumnId: number;
  PreviewtypesDropDown: any = [];
  PreviewtypesAutocomplete: any = [];
  public types: any = ['Text', 'Number', 'Date/Time']
  CfdcomboValuesDropDown: string;
  CfdcomboValuesAutocomplete: string;
  cfdcomboValuesString: string;
  public NotPermitted: boolean = false;
  stateFields: StateFields = {
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
    isUnique: false,
    dateDefaultPlusMinus: '',
    dateDefaultNumber: null,
    dateDefaulInterval: '',
    timeDefaultPlusMinus: '',
    timeNumberOfHours: null,
    timeNumberOFMinutes: null,
    offsetDateFields: '',
    offsetTimeFields: '',
  }

  ngOnInit() {
    this.spinner.show();
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    this.showForm = false;
    this.isActive = false;
    this.GetStateFields();

  }

  GetStateFields() {
    this.customfieldservice.GetStateFields(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
        this.spinner.hide();
      })).subscribe(result => {

        if (result.code == 403) {
          this.NotPermitted = true;
        }
        else {
          if (result.entity != null) {
            this.CustomFields = result.entity;
          }
        }
      })
  }



  onOptionsSelected(event) {
    this.AddJsFunction();
  }


  deleteField(id) {

    this.spinner.show();
    this.customfieldservice.Deletecustomfield(id, this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {

          if (result.code == 403) {
            this.toaster.warning(result.message);
          }
          else
            if (result) {
              this.toaster.success("delete successfully");
              this.GetStateFields();
            }
        },
        error => {
          this.error = error;
          this.spinner.hide();
        });

  }


  AdvanceOption() {
    this.stateFields.customFieldSpecialType = "";
    this.AddJsFunction();
  }




  ComboBoxChangeDropDown(value) {
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
  openmenu(item) {

    this.PreviewtypesDropDown = [];
    this.CustomFields.forEach(element => {
      if (item.columnId != element.columnId)
        element.isActive = false;
    });
    item.isActive = !item.isActive;
    this.stateFields = item;
    this.CfdcomboValuesDropDown = this.stateFields.comboBoxValue;
    if (this.stateFields.customFieldSpecialType == 'Dropdown') {
      this.ComboBoxChangeDropDown(this.CfdcomboValuesDropDown);
    }
    if (this.stateFields.customFieldSpecialType == 'Autocomplete') {
      this.ComboBoxChangeAutocomlete(item.comboBoxValue);
    }
    this.EditMode = !this.EditMode;
    this.showForm = false;
    this.AddJsFunction();
    this.ModalSetFunction();
  }
  closemenu(item) {


    item.isActive = !item.isActive;
    this.stateFields = item;
    this.EditMode = false;
    this.stateFields = {
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
      isUnique: false,
      dateDefaultPlusMinus: '',
      dateDefaultNumber: null,
      dateDefaulInterval: '',
      timeDefaultPlusMinus: '',
      timeNumberOfHours: null,
      timeNumberOFMinutes: null,
      offsetDateFields: '',
      offsetTimeFields: '',
    }

  }
  AddJsFunction() {
    setTimeout(function () {
      inputClear();
      inputFocus();
    }, 300)
  }

  ModalSetFunction() {
    setTimeout(function () {
      modal();
    }, 200)
  }

  onSubmit() {
    if (this.stateFields.customFieldSpecialType == "Autocomplete" || this.stateFields.customFieldSpecialType == "Dropdown") {
      this.stateFields.comboBoxValue = this.cfdcomboValuesString;
    }

    this.stateFields.customFieldType = "StateField";
    this.spinner.show();
    this.customfieldservice.AddStateFields(this.stateFields, this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {


          if (result.entity == true) {
            if (this.EditMode)
              this.toaster.success("Updated successfully");
            // alert("update Successfully");
            else
              this.toaster.success("add Successfully");
            // alert("");
            document.getElementById("closeModal").click();
            this.showForm = false;
            this.SelectedEditColumnId = null;
            this.stateFields = {
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
              isUnique: false,
              dateDefaultPlusMinus: '',
              dateDefaultNumber: null,
              dateDefaulInterval: '',
              timeDefaultPlusMinus: '',
              timeNumberOfHours: null,
              timeNumberOFMinutes: null,
              offsetDateFields: '',
              offsetTimeFields: '',
            }

            this.GetStateFields();
          }
          else {
            this.toaster.warning(result.message);


            // alert();
          }

        },
        error => {
          this.error = error;
          this.spinner.hide();
        });
  }

  showForms() {

    this.stateFields = {
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
      isUnique: false,
      dateDefaultPlusMinus: '',
      dateDefaultNumber: null,
      dateDefaulInterval: '',
      timeDefaultPlusMinus: '',
      timeNumberOfHours: null,
      timeNumberOFMinutes: null,
      offsetDateFields: '',
      offsetTimeFields: '',
    }
    this.CfdcomboValuesDropDown = "";
    this.CfdcomboValuesAutocomplete = "";
    this.PreviewtypesDropDown = [];
    this.PreviewtypesAutocomplete = [];
    this.SelectedEditColumnId = null;
    this.showForm = true;
    this.CustomFields.forEach(element => {
      element.isActive = false;
    });
    this.AddJsFunction();
    this.ModalSetFunction();
  }

  HideForm() {
    this.showForm = false;
    this.EditMode = false;
    this.SelectedEditColumnId = null;
  }

  showoffsetdatefields(value) {
    this.stateFields.offsetDateFields = value;
    if (value == 'false' || value == 'none') {
      this.stateFields.dateDefaultPlusMinus = "";
      this.stateFields.dateDefaultNumber = null;
      this.stateFields.dateDefaulInterval = "";
      if (value == 'none') {
        this.stateFields.offsetTimeFields = value;
      }
    }
    this.AddJsFunction();
  }

  showoffsettimefields(value) {
    this.stateFields.offsetTimeFields = value;
    if (value == 'false' || value == 'none') {
      this.stateFields.timeDefaultPlusMinus = '';
      this.stateFields.timeNumberOfHours = null;
      this.stateFields.timeNumberOFMinutes = null;
    }
    this.AddJsFunction();
  }


  AdvanceOptionChange() {

    // if (this.EditMode == false) {
    this.stateFields.dateDefaultPlusMinus = '';
    this.stateFields.dateDefaultNumber = null;
    this.stateFields.dateDefaulInterval = '';
    this.stateFields.timeDefaultPlusMinus = '';
    this.stateFields.timeNumberOfHours = null;
    this.stateFields.timeNumberOFMinutes = null;
    this.stateFields.offsetDateFields = 'false';
    this.stateFields.offsetTimeFields = 'false';
    // }
    this.AddJsFunction();
  }
  closeModal() {

    if (this.EditMode == false) {
      this.stateFields.customFieldSpecialType = '';
      this.AdvanceOptionChange();
    }
    this.HideForm();
  }

  CheckIsDisabled() {
    var DValue = false;
    var TValue = false;
    if (this.stateFields.customFieldSpecialType == 'Date' && this.stateFields.offsetDateFields == 'true') {
      return this.CheckForDate();

    }
    if (this.stateFields.customFieldSpecialType == 'Time' && this.stateFields.offsetTimeFields == 'true') {
      return this.CheckForTime();
    }
    if (this.stateFields.customFieldSpecialType == "Date & Time") {
      if (this.stateFields.offsetDateFields == 'true') {
        DValue = this.CheckForDate();

      }
      if (this.stateFields.offsetTimeFields == 'true') {
        TValue = this.CheckForTime();
      }

      if (DValue || TValue) {
        return true;

      }
      else {
        return false
      }
    }
    return false;
  }

  CheckForDate() {
    if (this.stateFields.columnLabel == '' || this.stateFields.dataType == '' || this.stateFields.dateDefaultPlusMinus == '' || this.stateFields.dateDefaultNumber == 0 || this.stateFields.dateDefaulInterval == '') {
      return true;
    }
    else {
      return false;
    }
  }

  CheckForTime() {
    if (this.stateFields.columnLabel == '' || this.stateFields.dataType == '' || this.stateFields.timeDefaultPlusMinus == '' || this.stateFields.timeNumberOfHours == null || this.stateFields.timeNumberOFMinutes == null) {
      return true;
    }
    else {
      return false;
    }
  }


  close() {
    this.addState = false;
    this.EditMode = false;
    this.SelectedEditColumnId = null;
  }

}
