import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { AttributeFields, CustomFields } from '../../models/customfieldmodel';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../core/auth.service';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { CustomFieldService } from '../../service/custom-field.service';
import modal from '../../../../assets/js/lib/_modal';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import tables from '../../../../assets/js/lib/_tables'
import { Router, Routes } from '@angular/router';
import { debug } from 'console';

@Component({
  selector: 'app-custom-fields',
  templateUrl: './custom-fields.component.html',
  styleUrls: ['./custom-fields.component.scss']
})
export class CustomFieldsComponent implements OnInit {
  @ViewChild('TextDialog', { static: false }) TextDialog: TemplateRef<any>;
  @ViewChild('NumberDialog', { static: false }) NumberDialog: TemplateRef<any>;
  @ViewChild('TrueFalseDialog', { static: false }) TrueFalseDialog: TemplateRef<any>;
  @ViewChild('DateDialog', { static: false }) DateDialog: TemplateRef<any>;
  public selectedTenantId: number;
  busy: boolean;
  error: string;
  CustomFields: any;
  columnName: any;
  public selectedId: number;
  deleteCustom = false;
  public addCustom: boolean;
  loadingRecords = false;
  EditMode: boolean = false;
  InputtypeNumber: any = ['Number', 'Currency']
  InputtypeDate: any = ['Date', 'Date & Time', 'Time']
  InputtypeBool: any = ['CheckBox']
  Inputtypes: any = ['OpenField', 'Dropdown', 'Autocomplete']
  public showForm: boolean;
  public showForm1: boolean;
  public showForm2: boolean;
  public showForm3: boolean;
  SelectedEditColumnId: number;
  PreviewtypesDropDown: any = [];
  PreviewtypesAutocomplete: any = [];
  CfdcomboValuesDropDown: string;
  CfdcomboValuesAutocomplete: string;
  cfdcomboValuesString: string;
  public NotPermitted: boolean = false;
  public types: any = ['Text', 'Number', 'Date/Time', 'True/False']
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
  length: number = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex = 0;
  lastPageIndex = 0;

  constructor(private router: Router, private authService: AuthService, private toastr: ToastrService, private spinner: NgxSpinnerService, private customfieldservice: CustomFieldService,) { }

  ngOnInit() {
    this.spinner.show();
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    this.showForm = false;
    this.EditMode = false;
    this.GetCustomFields();
    modal();


  }


  GetCustomFields() {
    this.loadingRecords = true;
    this.customfieldservice.GetCustomFields(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
        this.spinner.hide();
      })).subscribe(result => {
        if (result.code == 403) {
          this.router.navigateByUrl('/notPermited');

        }
        else {
          if (result.entity != null) {

            this.loadingRecords = false;
            this.CustomFields = result.entity;
            this.length = result.entity.length;
          }
        }
      })
  }


  openmenu(item) {

    this.PreviewtypesDropDown = [];
    this.CustomFields.forEach(element => {
      if (item.columnId != element.columnId)
        element.isActive = false;
    });
    item.isActive = !item.isActive;
    this.EditMode = !this.EditMode;
    this.customField = item;
    this.CfdcomboValuesDropDown = this.customField.comboBoxValue;
    if (this.customField.customFieldSpecialType == 'Dropdown') {
      this.ComboBoxChangeDropDown(this.CfdcomboValuesDropDown);
    }
    if (this.customField.customFieldSpecialType == 'Autocomplete') {
      this.ComboBoxChangeAutocomlete(item.comboBoxValue);
    }

    this.showForm = false;
    this.AddJsFunction();
    this.ModalSetFunction();
  }

  closemenu(item) {
    this.CustomFields.forEach(element => {
      if (item.columnId != element.columnId)
        element.isActive = false;
    });
    item.isActive = !item.isActive;
    this.EditMode = false;
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

  deleteField() {

    this.spinner.show();
    this.customfieldservice.Deletecustomfield(this.selectedId, this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {
          if (result.code == 403) {
            this.toastr.warning(result.message);
          }
          else {
            if (result) {
              this.toastr.success("Delete Successfully");
              this.GetCustomFields();
            }
          }
        },
        error => {
          this.error = error;
          this.spinner.hide();
        });
  }


  ComboBoxChangeDropDown(value) {

    this.cfdcomboValuesString = "";

    // this.PreviewtypesDropDown = value.split("\n");
    this.PreviewtypesDropDown = JSON.parse(value);
    this.cfdcomboValuesString = this.PreviewtypesDropDown.reduce((current, value, index) => {
      if (index > 0 && value != '') {
        current += '\n';
      }
      return current + $.trim(value);
    }, '');
  }
  onChangeSearch(val: string) {

    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
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


  AdvanceOption() {
    this.customField.customFieldSpecialType = "";
    this.AddJsFunction();
  }


  onSubmit() {


    if (this.customField.customFieldSpecialType == "Autocomplete" || this.customField.customFieldSpecialType == "Dropdown") {
      this.customField.comboBoxValue = this.cfdcomboValuesString;
    }
    this.customField.customFieldType = "CustomField";
    this.spinner.show();
    this.customfieldservice.AddCustomFields(this.customField, this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {
          if (result) {
            if (result.code == 200) {
              if (this.EditMode)
                this.toastr.success("Your Custom Field Is Successfully Update.");
              else {

                this.toastr.success("Your Custom Field Is Successfully Add.");
              }
              document.getElementById("closeModal").click();
              this.showForm = false;
              this.SelectedEditColumnId = null;
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
              this.GetCustomFields();
              this.AddJsFunction();
            }
            else {
              this.toastr.warning(result.message);
            }
          }
        },
        error => {
          this.error = error;
          this.spinner.hide();
        });
  }

  showForms() {
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



  onOptionsSelected(event) {
    this.AddJsFunction();
  }

  HideForm() {
    this.showForm = false;
    this.EditMode = false;
    this.SelectedEditColumnId = null;
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



  closeModal() {
    this.HideForm();
  }

  CheckIsDisabled() {
    var DValue = false;
    var TValue = false;
    if (this.customField.customFieldSpecialType == 'Date' && this.customField.offsetDateFields == 'true') {
      return this.CheckForDate();

    }
    if (this.customField.customFieldSpecialType == 'Time' && this.customField.offsetTimeFields == 'true') {
      return this.CheckForTime();
    }
    if (this.customField.customFieldSpecialType == "Date & Time") {
      if (this.customField.offsetDateFields == 'true') {
        DValue = this.CheckForDate();

      }
      if (this.customField.offsetTimeFields == 'true') {
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
    if (this.customField.columnLabel == '' || this.customField.dataType == '' || this.customField.dateDefaultPlusMinus == '' || this.customField.dateDefaultNumber == 0 || this.customField.dateDefaulInterval == '') {
      return true;
    }
    else {
      return false;
    }
  }

  CheckForTime() {
    if (this.customField.columnLabel == '' || this.customField.dataType == '' || this.customField.timeDefaultPlusMinus == '' || this.customField.timeNumberOfHours == null || this.customField.timeNumberOFMinutes == null) {
      return true;
    }
    else {
      return false;
    }
  }


  close() {
    this.addCustom = false;
    this.EditMode = false;
    this.SelectedEditColumnId = null;
  }
  DeleteConfirm(item) {

    this.selectedId = item.columnId;
    this.deleteCustom = true;
  }
  deleteValue(value: boolean) {
    const html = document.querySelector('html');
    html.classList.remove('js-modal-page');
    this.deleteCustom = false;
  }
  gotoFirstPage() {
    this.pageIndex = 0;
    this.GetCustomFields();
  }
  gotoLastPage() {

    this.pageIndex = this.length / this.pageSize;
    this.pageIndex = parseInt(this.pageIndex.toString())
    this.GetCustomFields();
  }
  gotoNext() {

    this.lastPageIndex = this.length / this.pageSize;
    this.lastPageIndex = parseInt(this.lastPageIndex.toString())
    if (this.pageIndex != this.lastPageIndex) {
      this.pageIndex++;
      this.GetCustomFields();
    }
  }
  gotoBack() {
    if (this.pageIndex > 0) {
      this.pageIndex = this.pageIndex - 1;
      this.GetCustomFields();
    }
  }
}
