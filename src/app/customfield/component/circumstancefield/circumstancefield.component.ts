import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CircumstanceFields } from '../../models/customfieldmodel';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../core/auth.service';
import { finalize } from 'rxjs/operators'
import { CustomFieldService } from '../../service/custom-field.service';
import { ToastrService } from 'ngx-toastr';
import tables from '../../../../assets/js/lib/_tables';
import modal from '../../../../assets/js/lib/_modal';
import toggle from '../../../../assets/js/lib/_toggle';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import datePicker from '../../../../assets/js/lib/_datePicker';
import dropdown from '../../../../assets/js/lib/_dropdown';
@Component({
  selector: 'app-circumstancefield',
  templateUrl: './circumstancefield.component.html',
  styleUrls: ['./circumstancefield.component.scss']
})
export class CircumstancefieldComponent implements OnInit {
  error: string;
  SelectedEditColumnId: number;
  showAdvance: boolean = false;
  EditMode: boolean = false;
  public addCicumstance: boolean;
  public types: any = ['Text', 'Number', 'Date/Time', 'True/False']
  InputtypeNumber: any = ['Number', 'Currency']
  InputtypeDate: any = ['Date', 'Date & Time', 'Time']
  InputtypeBool: any = ['CheckBox']
  Inputtypes: any = ['OpenField', 'Dropdown', 'Autocomplete']
  public NotPermitted: boolean = false;

  //DROPDOWN OBJECTS
  PreviewtypesDropDown: any = [];
  CfdcomboValuesDropDown: string;

  //AUTOCOMPLETE OBJECTS
  PreviewtypesAutocomplete: any = [];
  CfdcomboValuesAutocomplete: string;

  cfdcomboValuesString: string;



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


  //TENANT ID
  public selectedTenantId: number;
  //MODEL

  public OpenModal: boolean = false;

  //CIRCUMSTANCE FIELDS FORM DATA
  curcumstanceFields: CircumstanceFields = {
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
    customFieldIncludeOnAdd: false,
    customFieldIncludeOnStatus: false,
    customFieldIncludeOnSubtract: false,
    customFieldIncludeOnMove: false,
    customFieldIncludeOnConvert: false,
    customFieldIncludeOnApply: false,
    customFieldIncludeOnMoveTagUpdate: false,
    customFieldTextMaxLength: 0,
    customFieldDefaultValue: '',
    customFieldNumberMin: 0,
    customFieldNumberMax: 0,
    customFieldNumberDecimalPlaces: 0,
    customFieldTrueLabel: '',
    customFieldFalseLabel: '',
    customFieldSpecialType: '',
    isLineItem: false,
    dateDefaultPlusMinus: '',
    dateDefaultNumber: null,
    dateDefaulInterval: '',
    timeDefaultPlusMinus: '',
    timeNumberOfHours: null,
    timeNumberOFMinutes: null,
    offsetDateFields: '',
    offsetTimeFields: '',

  }


  public selectedType: string;
  busy: boolean;
  CustomFields: any;
  public showForm: boolean;
  public showForm1: boolean;
  public showForm2: boolean;
  public showForm3: boolean;
  public validate: boolean = false;
  masterSelected: boolean;
  checklist: any;
  checkedList: any;
  keyword: 'string';


  constructor(private authService: AuthService, private toastr: ToastrService, private spinner: NgxSpinnerService, private customfieldservice: CustomFieldService) {
    this.masterSelected = false;
    this.checklist = [
      { id: 1, value: 'Add', isSelected: false },
      { id: 2, value: 'Remove', isSelected: false },
      { id: 3, value: 'Move', isSelected: false },
      { id: 4, value: 'Change', isSelected: false },
      { id: 5, value: 'Convert', isSelected: false },
      { id: 6, value: 'Update', isSelected: false },
      { id: 7, value: 'Move & Change', isSelected: false }
    ];
  }

  ngOnInit(): void {
    this.spinner.show();
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    this.showForm = false;
    this.GetCurcumstanceFields();

  }

  // Get Custom fields list
  GetCurcumstanceFields() {
    this.customfieldservice.GetCurcumstanceFields(this.selectedTenantId, this.authService.accessToken)
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


  showForms() {
    this.curcumstanceFields = {
      columnId: 0,
      columnName: '',
      columnLabel: '',
      customFieldType: '',
      dataType: '',
      columnValue: '',
      comboBoxValue: '',
      customFieldIsRequired: false,
      customFieldPrefix: '',
      customFieldInformation: '',
      customFieldSuffix: '',
      customFieldIsIncremental: false,
      customFieldBaseValue: 0,
      customFieldIncrementBy: 0,
      customFieldIncludeOnAdd: false,
      customFieldIncludeOnStatus: false,
      customFieldIncludeOnSubtract: false,
      customFieldIncludeOnMove: false,
      customFieldIncludeOnConvert: false,
      customFieldIncludeOnApply: false,
      customFieldIncludeOnMoveTagUpdate: false,
      customFieldTextMaxLength: 0,
      customFieldDefaultValue: '',
      customFieldNumberMin: 0,
      customFieldNumberMax: 0,
      customFieldNumberDecimalPlaces: 0,
      customFieldTrueLabel: '',
      customFieldFalseLabel: '',
      customFieldSpecialType: '',
      isLineItem: false,
      dateDefaultPlusMinus: '',
      dateDefaultNumber: null,
      dateDefaulInterval: '',
      timeDefaultPlusMinus: '',
      timeNumberOfHours: null,
      timeNumberOFMinutes: null,
      offsetDateFields: '',
      offsetTimeFields: '',
    }
    this.masterSelected = false;
    this.checklist = [
      { id: 1, value: 'Add', isSelected: false },
      { id: 2, value: 'Remove', isSelected: false },
      { id: 3, value: 'Move', isSelected: false },
      { id: 4, value: 'Change', isSelected: false },
      { id: 5, value: 'Convert', isSelected: false },
      { id: 6, value: 'Update', isSelected: false },
      { id: 7, value: 'Move & Change', isSelected: false }
    ];

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

  OpenMenu(item) {
    this.PreviewtypesDropDown = [];
    this.showForm = false;
    this.CustomFields.forEach(element => {
      if (item.columnId != element.columnId)
        element.isActive = false;
    });
    item.isActive = !item.isActive;
    this.curcumstanceFields = item;
    this.EditMode = !this.EditMode;
    this.checklist[0].isSelected = this.curcumstanceFields.customFieldIncludeOnAdd;
    this.checklist[1].isSelected = this.curcumstanceFields.customFieldIncludeOnSubtract
    this.checklist[2].isSelected = this.curcumstanceFields.customFieldIncludeOnMove;
    this.checklist[3].isSelected = this.curcumstanceFields.customFieldIncludeOnApply;
    this.checklist[4].isSelected = this.curcumstanceFields.customFieldIncludeOnConvert;
    this.checklist[5].isSelected = this.curcumstanceFields.customFieldIncludeOnStatus;
    this.checklist[6].isSelected = this.curcumstanceFields.customFieldIncludeOnMoveTagUpdate;
    this.showForm = false;
    this.CfdcomboValuesDropDown = this.curcumstanceFields.comboBoxValue;
    if (this.curcumstanceFields.customFieldSpecialType == 'Dropdown') {
      this.ComboBoxChangeDropDown(this.CfdcomboValuesDropDown);
    }
    this
    this.isAllSelected();
    this.AddJsFunction();
    this.ModalSetFunction();
  }

  CloseMenu(item) {
    item.isActive = false;
    this.curcumstanceFields = {
      columnId: 0,
      columnName: '',
      columnLabel: '',
      customFieldType: '',
      dataType: '',
      columnValue: '',
      comboBoxValue: '',
      customFieldIsRequired: false,
      customFieldPrefix: '',
      customFieldInformation: '',
      customFieldSuffix: '',
      customFieldIsIncremental: false,
      customFieldBaseValue: 0,
      customFieldIncrementBy: 0,
      customFieldIncludeOnAdd: false,
      customFieldIncludeOnStatus: false,
      customFieldIncludeOnSubtract: false,
      customFieldIncludeOnMove: false,
      customFieldIncludeOnConvert: false,
      customFieldIncludeOnApply: false,
      customFieldIncludeOnMoveTagUpdate: false,
      customFieldTextMaxLength: 0,
      customFieldDefaultValue: '',
      customFieldNumberMin: 0,
      customFieldNumberMax: 0,
      customFieldNumberDecimalPlaces: 0,
      customFieldTrueLabel: '',
      customFieldFalseLabel: '',
      customFieldSpecialType: '',
      isLineItem: false,
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
  checkUncheckAll() {
    debugger;
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].isSelected = this.masterSelected;
    }
  }
  isAllSelected() {

    this.masterSelected = this.checklist.every(function (item: any) {
      return item.isSelected == true;
    })
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    this.checkedList = [];
    for (var i = 0; i < this.checklist.length; i++) {
      if (this.checklist[i].isSelected)
        this.checkedList.push(this.checklist[i]);
    }
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
            this.toastr.warning(result.message);
          }
          else {
            if (result) {
              this.toastr.success("Deleted Successfully");
              this.GetCurcumstanceFields();
            }
          }
        },
        error => {
          this.error = error;
          this.spinner.hide();
        });
  }
  AdvanceOption() {
    this.curcumstanceFields.customFieldSpecialType = "";
    this.AddJsFunction();
  }
  showoffsetdatefields(value) {
    this.curcumstanceFields.offsetDateFields = value;
    if (value == 'false' || value == 'none') {
      this.curcumstanceFields.dateDefaultPlusMinus = "";
      this.curcumstanceFields.dateDefaultNumber = null;
      this.curcumstanceFields.dateDefaulInterval = "";
      if (value == 'none') {
        this.curcumstanceFields.offsetTimeFields = value;
      }
    }
    this.AddJsFunction();
  }

  showoffsettimefields(value) {
    this.curcumstanceFields.offsetTimeFields = value;
    if (value == 'false' || value == 'none') {
      this.curcumstanceFields.timeDefaultPlusMinus = '';
      this.curcumstanceFields.timeNumberOfHours = null;
      this.curcumstanceFields.timeNumberOFMinutes = null;
    }
    this.AddJsFunction();
  }
  onOptionsSelected(event) {
    this.AddJsFunction();
  }
  Edit(data) {

    this.PreviewtypesDropDown = [];
    this.PreviewtypesAutocomplete = [];
    this.SelectedEditColumnId = data.columnId;
    this.curcumstanceFields = data;
    this.checklist[0].isSelected = this.curcumstanceFields.customFieldIncludeOnAdd;
    this.checklist[1].isSelected = this.curcumstanceFields.customFieldIncludeOnSubtract
    this.checklist[2].isSelected = this.curcumstanceFields.customFieldIncludeOnMove;
    this.checklist[3].isSelected = this.curcumstanceFields.customFieldIncludeOnApply;
    this.checklist[4].isSelected = this.curcumstanceFields.customFieldIncludeOnConvert;
    this.checklist[5].isSelected = this.curcumstanceFields.customFieldIncludeOnStatus;
    this.checklist[6].isSelected = this.curcumstanceFields.customFieldIncludeOnMoveTagUpdate;
    this.CfdcomboValuesDropDown = this.curcumstanceFields.comboBoxValue;
    if (this.curcumstanceFields.customFieldSpecialType == 'Autocomplete') {
      this.ComboBoxChangeAutocomlete(data.comboBoxValue);
    }
    if (this.curcumstanceFields.customFieldSpecialType == 'Dropdown') {
      this.ComboBoxChangeDropDown(this.CfdcomboValuesDropDown);
    }
    this.EditMode = true;
    this.isAllSelected();

  }

  onSubmit() {

    if (this.curcumstanceFields.customFieldSpecialType == "Autocomplete" || this.curcumstanceFields.customFieldSpecialType == "Dropdown") {
      this.curcumstanceFields.comboBoxValue = this.cfdcomboValuesString;
    }

    //Event Object filling 
    this.curcumstanceFields.customFieldIncludeOnAdd = this.checklist[0].isSelected;
    this.curcumstanceFields.customFieldIncludeOnSubtract = this.checklist[1].isSelected;
    this.curcumstanceFields.customFieldIncludeOnMove = this.checklist[2].isSelected;
    this.curcumstanceFields.customFieldIncludeOnApply = this.checklist[3].isSelected;
    this.curcumstanceFields.customFieldIncludeOnConvert = this.checklist[4].isSelected;
    this.curcumstanceFields.customFieldIncludeOnStatus = this.checklist[5].isSelected;
    this.curcumstanceFields.customFieldIncludeOnMoveTagUpdate = this.checklist[6].isSelected;

    // Field type 
    this.curcumstanceFields.customFieldType = "CircumstanceField";

    this.spinner.show();

    this.customfieldservice.AddCircumstanceFields(this.curcumstanceFields, this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {

          if (result.entity == true) {
            if (this.EditMode)
              this.toastr.success("Update successfully");

            else
              this.toastr.success("Add successfully");

            document.getElementById("closeModal").click();
            this.showForm = false;
            this.SelectedEditColumnId = null;
            this.checklist = [
              { id: 1, value: 'Add', isSelected: false },
              { id: 2, value: 'Remove', isSelected: false },
              { id: 3, value: 'Move', isSelected: false },
              { id: 4, value: 'Change', isSelected: false },
              { id: 5, value: 'Convert', isSelected: false },
              { id: 6, value: 'Update', isSelected: false },
              { id: 7, value: 'Move & Change', isSelected: false }
            ];
            this.curcumstanceFields = {
              columnId: 0,
              columnName: '',
              columnLabel: '',
              customFieldType: '',
              dataType: '',
              columnValue: '',
              comboBoxValue: '',
              customFieldIsRequired: false,
              customFieldPrefix: '',
              customFieldInformation: '',
              customFieldSuffix: '',
              customFieldIsIncremental: false,
              customFieldBaseValue: 0,
              customFieldIncrementBy: 0,
              customFieldIncludeOnAdd: false,
              customFieldIncludeOnStatus: false,
              customFieldIncludeOnSubtract: false,
              customFieldIncludeOnMove: false,
              customFieldIncludeOnConvert: false,
              customFieldIncludeOnApply: false,
              customFieldIncludeOnMoveTagUpdate: false,
              customFieldTextMaxLength: 0,
              customFieldDefaultValue: '',
              customFieldNumberMin: 0,
              customFieldNumberMax: 0,
              customFieldNumberDecimalPlaces: 0,
              customFieldTrueLabel: '',
              customFieldFalseLabel: '',
              customFieldSpecialType: '',
              isLineItem: false,
              dateDefaultPlusMinus: '',
              dateDefaultNumber: null,
              dateDefaulInterval: '',
              timeDefaultPlusMinus: '',
              timeNumberOfHours: null,
              timeNumberOFMinutes: null,
              offsetDateFields: '',
              offsetTimeFields: '',
            }
            this.GetCurcumstanceFields();
          }
          else {
            this.toastr.success(result.message);
            // alert();
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
  CircumstanceRow() {
    this.addCicumstance = true;
    this.EditMode = false;
  }
  close() {
    this.addCicumstance = false;
    this.EditMode = false;
    this.showForm = false;
    this.SelectedEditColumnId = null;
  }

  CheckIsDisabled() {
    var DValue = false;
    var TValue = false;
    if (this.curcumstanceFields.customFieldSpecialType == 'Date' && this.curcumstanceFields.offsetDateFields == 'true') {
      return this.CheckForDate();

    }
    if (this.curcumstanceFields.customFieldSpecialType == 'Time' && this.curcumstanceFields.offsetTimeFields == 'true') {
      return this.CheckForTime();
    }
    if (this.curcumstanceFields.customFieldSpecialType == "Date & Time") {
      if (this.curcumstanceFields.offsetDateFields == 'true') {
        DValue = this.CheckForDate();

      }
      if (this.curcumstanceFields.offsetTimeFields == 'true') {
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
    if (this.curcumstanceFields.columnLabel == '' || this.curcumstanceFields.dataType == '' || this.curcumstanceFields.dateDefaultPlusMinus == '' || this.curcumstanceFields.dateDefaultNumber == 0 || this.curcumstanceFields.dateDefaulInterval == '') {
      return true;
    }
    else {
      return false;
    }
  }

  CheckForTime() {
    if (this.curcumstanceFields.columnLabel == '' || this.curcumstanceFields.dataType == '' || this.curcumstanceFields.timeDefaultPlusMinus == '' || this.curcumstanceFields.timeNumberOfHours == null || this.curcumstanceFields.timeNumberOFMinutes == null) {
      return true;
    }
    else {
      return false;
    }
  }
}
