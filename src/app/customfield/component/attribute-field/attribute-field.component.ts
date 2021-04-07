import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { AttributeFields } from '../../models/customfieldmodel';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../core/auth.service';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { CustomFieldService } from '../../service/custom-field.service';
import modal from '../../../../assets/js/lib/_modal';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import { Router, Routes } from '@angular/router';
import tables from '../../../../assets/js/lib/_tables'
import { debug } from 'console';
// import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-attribute-field',
  templateUrl: './attribute-field.component.html',
  styleUrls: ['./attribute-field.component.scss']
})
export class AttributeFieldsComponent implements OnInit {
  @ViewChild('TextDialog', { static: false }) TextDialog: TemplateRef<any>;
  @ViewChild('NumberDialog', { static: false }) NumberDialog: TemplateRef<any>;
  @ViewChild('TrueFalseDialog', { static: false }) TrueFalseDialog: TemplateRef<any>;
  @ViewChild('DateDialog', { static: false }) DateDialog: TemplateRef<any>;
  public selectedTenantId: number;
  busy: boolean;
  error: string;
  CustomFields: any;
  columnName: any;
  loadingRecords = false;
  public addAttribute: boolean;
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
  public selectedId: number;
  public deleteCustom: boolean = false;
  attributeFields: AttributeFields = {
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
    this.GetAttributeFields();


  }


  GetAttributeFields() {
    this.loadingRecords = true;
    this.customfieldservice.GetAttributeFields(this.selectedTenantId, this.authService.accessToken)
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
    this.attributeFields = item;
    this.CfdcomboValuesDropDown = this.attributeFields.comboBoxValue;
    if (this.attributeFields.customFieldSpecialType == 'Dropdown') {
      this.ComboBoxChangeDropDown(this.CfdcomboValuesDropDown);
    }
    if (this.attributeFields.customFieldSpecialType == 'Autocomplete') {
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
    this.attributeFields = {
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

  deleteField(id) {

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
              this.GetAttributeFields();
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
    this.PreviewtypesDropDown = value.split("\n");
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
    this.attributeFields.customFieldSpecialType = "";
    this.AddJsFunction();
  }


  onSubmit() {


    if (this.attributeFields.customFieldSpecialType == "Autocomplete" || this.attributeFields.customFieldSpecialType == "Dropdown") {
      this.attributeFields.comboBoxValue = this.cfdcomboValuesString;
    }
    if (this.attributeFields.customFieldBaseValue == null || this.attributeFields.customFieldIncrementBy == null) {
      this.attributeFields.customFieldBaseValue = 0;
      this.attributeFields.customFieldIncrementBy = 0;
    }
    this.attributeFields.customFieldType = "AttributeField";
    this.spinner.show();
    this.customfieldservice.AddAttributeFields(this.attributeFields, this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {

          if (result.entity == true) {
            if (this.EditMode)
              this.toastr.success("Update  Successfully");
            else {

              this.toastr.success("Add Successfully");
            }
            document.getElementById("closeModal").click();
            this.showForm = false;
            this.SelectedEditColumnId = null;
            this.attributeFields = {
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
            this.GetAttributeFields();
            this.AddJsFunction();
          }
          else {
            this.toastr.warning(result.message);
          }
        },
        error => {
          this.error = error;
          this.spinner.hide();
        });
  }

  showForms() {
    this.attributeFields = {
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

    this.attributeFields.offsetDateFields = value;
    if (value == 'false' || value == 'none') {
      this.attributeFields.dateDefaultPlusMinus = "";
      this.attributeFields.dateDefaultNumber = null;
      this.attributeFields.dateDefaulInterval = "";
      if (value == 'none') {
        this.attributeFields.offsetTimeFields = value;
      }
    }
    this.AddJsFunction();
  }


  showoffsettimefields(value) {
    this.attributeFields.offsetTimeFields = value;
    if (value == 'false' || value == 'none') {
      this.attributeFields.timeDefaultPlusMinus = '';
      this.attributeFields.timeNumberOfHours = null;
      this.attributeFields.timeNumberOFMinutes = null;
    }
    this.AddJsFunction();
  }



  closeModal() {
    this.HideForm();
  }

  CheckIsDisabled() {
    var DValue = false;
    var TValue = false;
    if (this.attributeFields.customFieldSpecialType == 'Date' && this.attributeFields.offsetDateFields == 'true') {
      return this.CheckForDate();

    }
    if (this.attributeFields.customFieldSpecialType == 'Time' && this.attributeFields.offsetTimeFields == 'true') {
      return this.CheckForTime();
    }
    if (this.attributeFields.customFieldSpecialType == "Date & Time") {
      if (this.attributeFields.offsetDateFields == 'true') {
        DValue = this.CheckForDate();

      }
      if (this.attributeFields.offsetTimeFields == 'true') {
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
    if (this.attributeFields.columnLabel == '' || this.attributeFields.dataType == '' || this.attributeFields.dateDefaultPlusMinus == '' || this.attributeFields.dateDefaultNumber == 0 || this.attributeFields.dateDefaulInterval == '') {
      return true;
    }
    else {
      return false;
    }
  }

  CheckForTime() {
    if (this.attributeFields.columnLabel == '' || this.attributeFields.dataType == '' || this.attributeFields.timeDefaultPlusMinus == '' || this.attributeFields.timeNumberOfHours == null || this.attributeFields.timeNumberOFMinutes == null) {
      return true;
    }
    else {
      return false;
    }
  }


  close() {
    this.addAttribute = false;
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
    this.GetAttributeFields();
  }
  gotoLastPage() {

    this.pageIndex = this.length / this.pageSize;
    this.pageIndex = parseInt(this.pageIndex.toString())
    this.GetAttributeFields();
  }
  gotoNext() {

    this.lastPageIndex = this.length / this.pageSize;
    this.lastPageIndex = parseInt(this.lastPageIndex.toString())
    if (this.pageIndex != this.lastPageIndex) {
      this.pageIndex++;
      this.GetAttributeFields();
    }
  }
  gotoBack() {
    if (this.pageIndex > 0) {
      this.pageIndex = this.pageIndex - 1;
      this.GetAttributeFields();
    }
  }
}

