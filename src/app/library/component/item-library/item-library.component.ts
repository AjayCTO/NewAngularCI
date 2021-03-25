import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators'
import { AuthService } from '../../../core/auth.service';
import { LibraryService } from '../../service/library.service';
import { CommanSharedService } from '../../../shared/service/comman-shared.service';
import { from, Observable } from 'rxjs';
import { CustomFieldService } from '../../../customfield/service/custom-field.service';
import { Part, CurrentInventory, StateFields, CircumstanceFields, DataColumnFilter } from '../../models/library-model'
import tables from '../../../../assets/js/lib/_tables';
import toggle from '../../../../assets/js/lib/_toggle';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import modal from '../../../../assets/js/lib/_modal';
import datePicker from '../../../../assets/js/lib/_datePicker';
import * as XLSX from 'xlsx';
import action from '../../../../assets/js/lib/_action';
import trigger from '../../../../assets/js/lib/_trigger';
import dropdown from '../../../../assets/js/lib/_dropdown';
import { ToastrService } from 'ngx-toastr';
import { Form, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AttributeFields } from '../../../customfield/models/customfieldmodel';
import { Router, Routes } from '@angular/router';
import { Workbook } from 'exceljs';
import jsPDF from 'jspdf';
import * as fs from 'file-saver';
import {
  DateTimeAdapter,
  OWL_DATE_TIME_FORMATS,
  OWL_DATE_TIME_LOCALE,
  OwlDateTimeComponent,
  OwlDateTimeFormats
} from 'ng-pick-datetime';
import * as _moment from "moment";
import { Moment } from "moment";
@Component({
  selector: 'app-item-library',
  templateUrl: './item-library.component.html',
  styleUrls: ['./item-library.component.scss']
})

export class ItemLibraryComponent implements OnInit {
  @ViewChild("filterButton", { static: true }) filterChange: ElementRef;
  @ViewChild('AddUOMClose', { static: true }) AddUOMClose: ElementRef<HTMLElement>;
  @ViewChild('AddLocationClose', { static: true }) AddLocationClose: ElementRef<HTMLElement>;
  @ViewChild('AddAttributeClose', { static: true }) AddAttributeClose: ElementRef<HTMLElement>;
  public myDT: Date;
  partformControl: FormGroup;
  public selectedTenantId: number;
  public error: string;
  public selecteditem: any = [];
  public busy: boolean;
  fileName = 'ExcelSheet.xlsx';
  public allInventoryItems
  public DeleteConfirmPopup: boolean;
  public myInventoryField: Observable<any>;
  public ImportDataBind: any
  public tabulatorColumn: any = [];
  public Itemlist: any;
  public ColumnDataType: string;
  searchFilterText: string;
  public showForm: boolean;
  public NotPermitted: boolean = false;
  public selectedPartItem: any;
  UploadActivityOpen: boolean;
  selectedUOm;
  public uomList: any[];
  public locationsList: any[];
  selectedLocation;
  public EditMode: boolean;
  public AttributeFields: any;
  CircumstanceFields: any;
  allItems: any;
  StateFields: any;
  public PartDataBind: any = [];
  public isLoadingResult: boolean = false;
  public data: any;
  public IsItemHave: boolean = false;
  public selectedStatus: "";
  public isSearchFilterActive: boolean = false;
  public uomForm: FormGroup;
  public locationForm: FormGroup;
  submitted = false;
  partForm: Part = {
    partName: '',
    partDescription: '',
    uomId: null,
    locationId: null,
    primaryImageId: null,
    lowQtyThreshold: 0,
    highQtyThreshold: 0,
    statusId: null,
    attributeFields: []
  };
  keys: string[] = [];
  Value: String[] = [];
  public Month = [{ 'id': '1', 'month': 'Janurary' }, { 'id': '2', 'month': 'February' }, { 'id': '3', 'month': 'March' }, { 'id': '4', 'month': 'April' }, { 'id': '5', 'month': 'May' }, { 'id': '6', 'month': 'June' }, { 'id': '7', 'month': 'July' }, { 'id': '8', 'month': 'August' }, { 'id': '9', 'month': 'September' }, { 'id': '10', 'month': 'October' }, { 'id': '11', 'month': 'November' }, { 'id': '12', 'month': 'December' },]
  public hour = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
  public minutes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
  public seconds = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
  public options = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
  public FilterArray: DataColumnFilter[] = [];
  public edititem: boolean;
  public dataColumnFilter: any = {
    columnName: "",
    displayName: "",
    filterOperator: "",
    searchValue: "",
    type: ""
  }

  length: number = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex = 0;
  lastPageIndex = 0;
  loadingRecords = false;

  //ADD NEW ATTRIBUTE FIELD
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
  public datatype: any = ['OpenField', 'Dropdown', 'Autocomplete', 'Number', 'Currency', 'Date', 'Date & Time', 'Time', 'True/False']
  public selectedDatatype: string;
  public cfdcomboValuesString: string;
  public item: any;
  public ColumnDataTypeSpecial: string
  public CfdcomboValuesDropDown: string;
  PreviewtypesDropDown: any = [];
  PreviewtypesAutocomplete: any = [];

  constructor(private router: Router, private formBuilder: FormBuilder, private toastr: ToastrService, private cdr: ChangeDetectorRef, private libraryService: LibraryService, private authService: AuthService,
    private spinner: NgxSpinnerService, private commanService: CommanSharedService,
    private customfieldservice: CustomFieldService) { }


  ngOnInit() {
    this.UploadActivityOpen = false;
    this.spinner.show();
    this.uomForm = this.formBuilder.group({
      uomName: ['', Validators.required],
    });
    this.locationForm = this.formBuilder.group({
      locationName: ['', Validators.required],
      description: ['', null],
      locationZone: ['', null],
    });

    this.searchFilterText = "";
    this.partformControl = this.formBuilder.group({
      partName: ['', Validators.required],
      partDescription: ['', null],
      uomId: ['', Validators.required],
      locationId: ['', Validators.required],
      lowQtyThreshold: null,
      highQtyThreshold: null,

    });
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    this.getUOMList();
    this.getLocationList();
    this.GetAttributeFields();
    this.GetMyInventoryColumn();

    this.ApplyJsFunction();

  }

  get f() { return this.partformControl.controls; }
  onReset() {
    this.submitted = false;
    this.partForm = {
      partName: '',
      partDescription: '',
      uomId: null,
      locationId: null,
      primaryImageId: null,
      lowQtyThreshold: 0,
      highQtyThreshold: 0,
      statusId: null,
      attributeFields: []
    }

    let el: HTMLElement = this.AddLocationClose.nativeElement;
    el.click();
    let el1: HTMLElement = this.AddAttributeClose.nativeElement;
    el1.click();
    let el2: HTMLElement = this.AddUOMClose.nativeElement;
    el2.click();
  }
  ApplyJsFunction() {
    setTimeout(function () {
      modal();
      toggle();
      inputClear();
      inputFocus();
      datePicker();
    }, 1000)
  }
  mainToggleDropdown = false;
  MainFilterToggle() {
    this.mainToggleDropdown = !this.mainToggleDropdown;
  }


  FilterOperartorSelect(data) {
    debugger;
    if (data == 'Equals') {
      this.dataColumnFilter.filterOperator = 'eq'
    }
    if (data == 'Does Not Equal') {
      this.dataColumnFilter.filterOperator = 'ne'
    }
    if (data == 'Contains') {
      this.dataColumnFilter.filterOperator = 'cn'
    }
    if (data == 'Does NOT Contain') {
      this.dataColumnFilter.filterOperator = 'nc'
    }
    if (data == 'Is Empty') {
      this.dataColumnFilter.filterOperator = 'Empty'
    }
    if (data == 'Begins With') {
      this.dataColumnFilter.filterOperator = 'bw'
    }
    if (data == 'Number Equals') {
      this.dataColumnFilter.filterOperator = 'num-eq'
    }
    if (data == 'Number Not Equal') {
      this.dataColumnFilter.filterOperator = 'num-ne'
    }
    if (data == 'Less Than or Equals') {
      this.dataColumnFilter.filterOperator = 'num-lte'
    }
    if (data == 'Greater Than or Equals') {
      this.dataColumnFilter.filterOperator = 'num-gte'
    }
    if (data == 'DateEquals') {
      this.dataColumnFilter.filterOperator = 'date-eq'
    }
    if (data == 'TimeEquals') {
      this.dataColumnFilter.filterOperator = 'time-eq'
    }
    if (data == 'Date Between') {
      this.dataColumnFilter.filterOperator = 'date-bw'
    }
    if (data == 'Minute Equals') {
      this.dataColumnFilter.filterOperator = 'date-minute'
    }
    if (data == 'Hour Equals') {
      this.dataColumnFilter.filterOperator = 'date-hour'
    }
    if (data == 'Second Equals') {
      this.dataColumnFilter.filterOperator = 'date-second'
    }
    if (data == 'Month Equals') {
      this.dataColumnFilter.filterOperator = 'date-month'
    }
    if (data == 'Day Equals') {
      this.dataColumnFilter.filterOperator = 'date-day'
    }
    if (data == 'Year Equals') {
      this.dataColumnFilter.filterOperator = 'date-year'
    }
    if (data == 'On Or After') {
      this.dataColumnFilter.filterOperator = 'date-after'
    }
    if (data == 'On Or Before') {
      this.dataColumnFilter.filterOperator = 'date-before'
    }
    if (data == 'On Or Time After') {
      this.dataColumnFilter.filterOperator = 'time-after'
    }
    if (data == 'On Or Time Before') {
      this.dataColumnFilter.filterOperator = 'time-before'
    }
    this.ApplyJsFunction200();
  }

  ExportToExecel() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Item List");
    let header = []
    let headerRow = worksheet.addRow(header);
  }


  onOptionsSelected(event) {


    this.tabulatorColumn.forEach(element => {

      if (element.field == event) {

        this.ColumnDataType = element.datatype;
        this.ColumnDataTypeSpecial = element.customFieldSpecialType
      }

    });
    setTimeout(function () {
      inputClear();
      inputFocus();
    }, 2000);
  }
  ClearAllFilter() {
    this.FilterArray = [];
    this.searchFilterText = "";

    this.GetParts();

  }
  onOptionsSelected2(event) {


    this.tabulatorColumn.forEach(element => {

      if (element.field == event) {

        this.ColumnDataType = element.datatype;
      }

    });

    setTimeout(function () {
      inputClear();
      inputFocus();
    }, 2000);
  }
  ApplyFilter() {

    if (this.dataColumnFilter.columnName == "" || this.dataColumnFilter.filterOperator == "" || this.dataColumnFilter.searchValue == "") {
      return false;
    }

    this.tabulatorColumn.forEach(element => {
      if (element.field == this.dataColumnFilter.columnName) {
        this.dataColumnFilter.displayName = element.title;
        this.dataColumnFilter.type = element.type;
        this.dataColumnFilter.datatype = element.datatype;
        element.inFilter = true;
        if (element.datatype == "Date/Time") {
          this.GetDate(element);
        }
      }
    });

    this.FilterArray.forEach((element, index) => {

      let attribute = this.dataColumnFilter.type == "" ? '' : "$.";
      if (element.columnName == attribute + this.dataColumnFilter.columnName) {
        this.FilterArray.splice(index, 1);
      }

    });

    this.FilterArray.push(this.dataColumnFilter);
    if (this.dataColumnFilter.type == "AttributeField" || this.dataColumnFilter.type == "StateField") {
      this.dataColumnFilter.columnName = "$." + this.dataColumnFilter.columnName;
    }
    this.dataColumnFilter = {
      columnName: "",
      displayName: "",
      filterOperator: "",
      searchValue: "",
      type: ""
    }
    this.mainToggleDropdown = false;
    this.GetParts();
  }
  RemoveFilter(data) {
    debugger
    this.FilterArray.forEach((element, index) => {

      if (element.columnName == data.columnName) {
        this.FilterArray.splice(index, 1);
      }

    });
    this.tabulatorColumn.forEach(element => {
      var pre = element.type == "AttributeField" ? '$.' : '';
      if (pre + element.field == data.columnName) {
        element.inFilter = false;
      }
    });
    this.GetParts();

  }
  CloseFilter() {
    this.mainToggleDropdown = !this.mainToggleDropdown;
  }
  ApplyFilter2(columnName) {
    this.dataColumnFilter.columnName = columnName;
    if (this.dataColumnFilter.columnName == "" || this.dataColumnFilter.filterOperator == "" || this.dataColumnFilter.searchValue == "") {
      return false;
    }

    this.tabulatorColumn.forEach(element => {
      if (element.field == this.dataColumnFilter.columnName) {
        this.dataColumnFilter.displayName = element.title;
        this.dataColumnFilter.type = element.type;
        this.dataColumnFilter.datatype = element.datatype;
        element.inFilter = true;
        element.opentoggleDropdown = !element.opentoggleDropdown
        if (element.datatype == "Date/Time") {
          this.GetDate(element);
        }
      }
    });


    this.FilterArray.forEach((element, index) => {

      let attribute = this.dataColumnFilter.type == "" ? '' : "$.";
      if (element.columnName == attribute + this.dataColumnFilter.columnName) {
        this.FilterArray.splice(index, 1);
      }

    });

    this.FilterArray.push(this.dataColumnFilter);
    if (this.dataColumnFilter.type == "AttributeField" || this.dataColumnFilter.type == "StateField") {
      this.dataColumnFilter.columnName = "$." + this.dataColumnFilter.columnName;
    }
    this.dataColumnFilter = {
      columnName: "",
      displayName: "",
      filterOperator: "",
      searchValue: "",
      type: ""
    }
    document.getElementById("filterButton2_" + columnName).click();

    this.GetParts();

  }
  toggleGlobalDropDown(event) {

    this.tabulatorColumn.forEach(element => {
      if (element.field == event) {
        this.ColumnDataType = element.datatype;
        element.opentoggleDropdown = !element.opentoggleDropdown;
      }
    });


    this.ApplyJsFunction200();
  }

  ApplyJsFunction200() {
    setTimeout(function () {
      inputClear();
      inputFocus();
      datePicker();
    }, 200)
  }
  closeGlobalDropDown(event) {
    this.tabulatorColumn.forEach(element => {
      if (element.field == event) {

        element.opentoggleDropdown = !element.opentoggleDropdown;
      }
    });
  }

  CloseFilter2(Id) {
    document.getElementById("filterButton3_" + Id).click();
    // window.location.reload();

  }

  onSubmit() {

    this.submitted = true;
    if (this.partformControl.invalid) {
      this.toastr.warning("Required", "Please fill required column");
      return;
    }
    this.spinner.show();
    this.partForm = this.partformControl.value;
    this.AttributeFields.forEach(element => {

      if (element.customFieldSpecialType == "Date & Time") {
        element.columnValue = (this.partformControl.value[element.columnId]);
      }

      else if (element.customFieldSpecialType == "Time") {
        element.columnValue = (this.partformControl.value[element.columnId]);
      }
      else if (element.customFieldSpecialType == "Date") {
        element.columnValue = (this.partformControl.value[element.columnId]);
      }
      else {

        element.columnValue = this.partformControl.value[element.columnId];
        if (element.customFieldPrefix != "" || element.customFieldSuffix != "") {
          element.columnValue = element.columnValue
        }
      }
    });
    this.partForm.attributeFields = this.AttributeFields;
    if (this.partForm.highQtyThreshold == null) {
      this.partForm.highQtyThreshold = 0;
    }
    if (this.partForm.lowQtyThreshold == null) {
      this.partForm.lowQtyThreshold = 0;
    }
    this.partForm.locationId = parseInt(this.partformControl.value.locationId);
    this.partForm.uomId = parseInt(this.partformControl.value.uomId);
    this.libraryService.AddEditPart(this.selectedTenantId, this.partForm, this.authService.accessToken).pipe(finalize(() => {
      this.spinner.hide();
    }))
      .subscribe(
        result => {
          if (result) {

            if (result.entity == true) {
              this.toastr.success("Your item is Successfully Added.");
              document.getElementById("Closebtn").click();
              this.onReset();
              this.GetParts();
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
  convertToString() {
    this.AttributeFields.forEach(element => {
      if (element.columnValue.type != 0) {
        element.columnValue.toDateString()
      }
    });
  }
  SelectedMonth(id) {

    this.Month.forEach(element => {
      if (element.id == id) {
        this.dataColumnFilter.searchValue = element.month;
      }
    })
  }
  getUOMList() {
    this.libraryService.GetUOM(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
        this.spinner.hide();
      })).subscribe(result => {
        this.uomList = result.entity;
        this.cdr.detectChanges();
      })
  }

  getLocationList() {
    this.libraryService.GetLocation(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
        this.spinner.hide();
      })).subscribe(result => {
        this.locationsList = result.entity;
      })
  }

  GetAttributeFields() {
    this.customfieldservice.GetAttributeFields(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
        this.spinner.hide();
      })).subscribe(result => {
        debugger;
        if (result.entity != null) {
          this.AttributeFields = result.entity;
          this.AttributeFields.forEach(element => {
            if (element.customFieldIsRequired) {
              this.partformControl.addControl(element.columnId, new FormControl('', Validators.required));
            }
            else {
              this.partformControl.addControl(element.columnId, new FormControl('', null));
            }

            if (element.customFieldBaseValue != 0) {
              this.partformControl.get("" + element.columnId + "").setValue(element.customFieldBaseValue);
            }
            if (element.dataType == "Date/Time") {
              this.partformControl.get("" + element.columnId + "").setValue(new Date(element.columnValue));

            }

          });

        }
      })
    this.ApplyJsFunction();
  }

  deleteItem(id) {
    this.spinner.show();

    this.libraryService.DeletePart(id, this.authService.accessToken)
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
              this.DeleteConfirmPopup = false;
              this.toastr.success("Successfully Delete.");

              this.GetParts();
            }
          }

        },
        error => {
          this.error = error;
          this.spinner.hide();
        });
  }


  AddNewUOM(form) {
    if (this.uomForm.invalid) {
      return;
    }
    this.spinner.show();
    this.uomForm.value;
    this.libraryService.AddUom(this.selectedTenantId, this.uomForm.value, this.authService.accessToken)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {
          if (result) {


            if (result.entity == true) {
              this.toastr.success("Your Uom is Successfully Add.");
              let el: HTMLElement = this.AddUOMClose.nativeElement;
              el.click();
              form.reset();
              this.getUOMList();

            }
            else {
              this.toastr.warning(result.message);
            }
          }
        });
  }



  GetMyInventoryColumn() {

    this.commanService.GetMyInventoryColumns(this.selectedTenantId, this.authService.accessToken).pipe(finalize(() => {
      this.busy = false;
      this.spinner.hide();
    })).subscribe(result => {

      if (result.entity != null) {
        this.myInventoryField = result.entity;
        // this.tabulatorColumn.push({ title: "Item Name", field: "partName", type: "", datatype: "string", width: "170" });
        // this.tabulatorColumn.push({ title: "Description", field: "partDescription", type: "", datatype: "string", width: "450" });
        // this.tabulatorColumn.push({ title: "Default Location", field: "locationName", type: "", datatype: "string", width: "170" });
        // this.tabulatorColumn.push({ title: " Defualt UOM", field: "uomName", type: "", datatype: "stringUom", width: "170" });
        this.myInventoryField.forEach(element => {
          if (element.customeFieldType == "AttributeField" || element.customeFieldType == "") {
            this.tabulatorColumn.push({ title: element.columnLabel, field: element.columnName, type: element.customeFieldType, datatype: element.dataType, customFieldSpecialType: element.customFieldSpecialType, width: "170" });
          }
        });
        this.item = result.entity;
        this.GetParts();
        this.ApplyJsFunction();


      }

    })
  }
  changeProject(event) {

  }


  gotoFirstPage() {
    this.pageIndex = 0;
    this.GetParts();
  }
  gotoLastPage() {

    this.pageIndex = this.length / this.pageSize;
    this.pageIndex = parseInt(this.pageIndex.toString())
    this.GetParts();
  }
  gotoNext() {

    this.lastPageIndex = this.length / this.pageSize;
    this.lastPageIndex = parseInt(this.lastPageIndex.toString())
    if (this.pageIndex != this.lastPageIndex) {
      this.pageIndex++;
      this.GetParts();
    }
  }
  gotoBack() {
    if (this.pageIndex > 0) {
      this.pageIndex = this.pageIndex - 1;
      this.GetParts();
    }
  }

  SearchFilter() {

    if (this.searchFilterText != undefined && this.searchFilterText != "") {
      this.isSearchFilterActive = true;
      this.GetParts();
      this.ApplyJsFunction();
    }
  }
  RemoveSearchFilter() {
    this.isSearchFilterActive = false;
    this.searchFilterText = ""
    this.GetParts();
    this.ApplyJsFunction();
  }



  GetParts() {
    this.loadingRecords = true;
    let sortCol = "PartName";
    let sortDir = "asc";

    this.libraryService.getAllPartWithPaging(this.selectedTenantId, this.authService.accessToken, this.pageIndex + 1, this.pageSize, sortCol, sortDir, this.searchFilterText, this.FilterArray)
      .pipe(finalize(() => {


      })).subscribe(result => {


        if (result.code == 403) {
          this.router.navigateByUrl('/notPermited');
        }
        this.loadingRecords = false;
        this.PartDataBind = [];
        this.allItems = [];

        this.allItems = result.entity.parts;
        this.length = result.entity.totalParts;

        for (let i = 0; i < this.allItems.length; i++) {
          let map = new Map<string, any>();
          for (let j = 0; j < this.tabulatorColumn.length; j++) {

            let keys = Object.keys(this.allItems[i])
            for (let key = 0; key < keys.length; key++) {

              if (keys[key] == this.tabulatorColumn[j].field) {

                map.set(this.tabulatorColumn[j].field, this.allItems[i][keys[key]])
              }
              else {
                map.set(keys[key], this.allItems[i][keys[key]])
              }
            }

            for (let k = 0; k < this.allItems[i].attributeFields.length; k++) {

              if (this.allItems[i].attributeFields[k].columnName == this.tabulatorColumn[j].field) {

                if (this.tabulatorColumn[j].datatype == "Date/Time") {
                  if (this.allItems[i].attributeFields[k].columnValue != "") {
                    this.myDT = new Date(this.allItems[i].attributeFields[k].columnValue)
                    let DateManual = this.myDT.toLocaleDateString();
                    if (this.tabulatorColumn[j].customFieldSpecialType == "Time") {
                      DateManual = this.myDT.toLocaleTimeString()
                    }
                    if (this.tabulatorColumn[j].customFieldSpecialType == "Date & Time") {
                      DateManual = this.myDT.toLocaleString();
                    }
                    if (this.tabulatorColumn[j].customFieldSpecialType == "Date") {
                      DateManual = this.myDT.toLocaleDateString()
                    }
                    map.set(this.tabulatorColumn[j].field, DateManual)
                  }
                  else {
                    map.set(this.tabulatorColumn[j].field, this.allItems[i].attributeFields[k].columnValue)
                  }
                }
                else {
                  map.set(this.tabulatorColumn[j].field, this.allItems[i].attributeFields[k].columnValue)
                }
              }
            }
          }

          let jsonObject = {};
          map.forEach((value, key) => {
            jsonObject[key] = value
          });

          this.PartDataBind.push(jsonObject);
        }
        modal();


      });
  }


  ShowUploadActivity() {

    this.UploadActivityOpen = true;
  }
  getValue(value: boolean) {
    this.UploadActivityOpen = false;
  }
  selectEvent(event, data) {

    data.columnValue = event;
  }

  ComboValueDropdown(Value) {

    let items = [];
    if (Value != null) {
      items = Value.split('\n');
    }
    return items;
  }

  DeleteConfirm(item) {

    this.selectedPartItem = item;
    this.DeleteConfirmPopup = true;
  }
  ClosePopup() {

    this.DeleteConfirmPopup = false;
  }


  AddNewAttribute(form) {
    // if (this.Attributeform.invalid) {
    //   return;
    // }
    this.spinner.show();

    if (this.attributeFields.customFieldSpecialType == "Autocomplete" || this.attributeFields.customFieldSpecialType == "Dropdown") {
      this.attributeFields.comboBoxValue = this.cfdcomboValuesString;
    }
    if (this.selectedDatatype == "Autocomplete" || this.selectedDatatype == "Dropdown" || this.selectedDatatype == "OpenField") {
      this.attributeFields.dataType = "Text";
    }
    if (this.selectedDatatype == "Number" || this.selectedDatatype == "Currency") {
      this.attributeFields.dataType = "Number";
    }
    if (this.selectedDatatype == "Date" || this.selectedDatatype == "Date & Time" || this.selectedDatatype == "Time") {
      this.attributeFields.dataType = "Date/Time";
    }
    if (this.selectedDatatype == "True/False") {
      this.attributeFields.dataType = "True/False";
    }
    this.attributeFields.customFieldSpecialType = this.selectedDatatype;
    this.customfieldservice.AddAttributeFields(this.attributeFields, this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {
          if (result) {


            if (result.entity == true) {
              this.toastr.success("Your Attribute is Successfully Add.");
              let el: HTMLElement = this.AddAttributeClose.nativeElement;
              el.click();
              form.reset();
              this.GetAttributeFields();


            }
            else {
              this.toastr.warning(result.message);
            }
          }
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

  //====Chirag====

  AddNewLocation(form) {



    if (this.locationForm.invalid) {
      return;
    }
    this.spinner.show();
    this.locationForm.value;
    this.libraryService.AddLocation(this.selectedTenantId, this.locationForm.value, this.authService.accessToken)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {
          if (result) {


            if (result.entity == true) {
              this.toastr.success("Your Location is Successfully add.");
              let el: HTMLElement = this.AddLocationClose.nativeElement;
              el.click();
              form.reset();
              this.getLocationList();

            }
            else {
              this.toastr.warning(result.message);
            }
          }
        });
  }
  Close(form) {
    //form.reset();
  }
  // 
  edit(item) {

    this.edititem = true;
    // this.PartDataBind=false;
    this.selecteditem = item;
    // localStorage.setItem('selectitem',JSON.stringify(this.selecteditem));


  }
  showDropDown = false;

  toggleDropDown() {
    this.showDropDown = !this.showDropDown;
    console.log('clicked');
  }
  closeDropDown() {
    this.showDropDown = false;
    console.log('clicked outside');
  }

  GetDate(element) {

    if (this.dataColumnFilter.filterOperator == 'date-eq') {
      this.GetdateFilter(element)
    }
    if (this.dataColumnFilter.filterOperator == 'time-eq') {
      this.GetdateFilter(element)
    }
    if (this.dataColumnFilter.filterOperator == 'date-bw') {
      let date1 = new Date(this.dataColumnFilter.searchValue[0]).toLocaleDateString();
      let date2 = new Date(this.dataColumnFilter.searchValue[1]).toLocaleDateString();
      this.dataColumnFilter.datevalue = date1 + " to " + date2;
      this.dataColumnFilter.searchValue = new Date(this.dataColumnFilter.searchValue[0]).toISOString() + " ~ " + new Date(this.dataColumnFilter.searchValue[1]).toISOString();

    }
    if (this.dataColumnFilter.filterOperator == 'date-minute') {
      this.dataColumnFilter.datevalue = this.dataColumnFilter.searchValue;
    }
    if (this.dataColumnFilter.filterOperator == 'date-hour') {
      this.dataColumnFilter.datevalue = this.dataColumnFilter.searchValue;
    }
    if (this.dataColumnFilter.filterOperator == 'date-second') {
      this.dataColumnFilter.datevalue = this.dataColumnFilter.searchValue;
    }
    if (this.dataColumnFilter.filterOperator == 'date-day') {
      this.dataColumnFilter.datevalue = this.dataColumnFilter.searchValue;
    }
    if (this.dataColumnFilter.filterOperator == 'date-after') {
      this.GetdateFilter(element)
    }
    if (this.dataColumnFilter.filterOperator == 'date-before') {
      this.GetdateFilter(element)
    }
    if (this.dataColumnFilter.filterOperator == 'time-before') {
      this.GetdateFilter(element)
    }
    if (this.dataColumnFilter.filterOperator == 'time-after') {
      this.GetdateFilter(element)
    }

  }
  GetdateFilter(element) {

    this.myDT = new Date(this.dataColumnFilter.searchValue)
    let DateManual = this.myDT.toLocaleDateString();
    if (element.customFieldSpecialType == "Time") {
      DateManual = this.myDT.toLocaleTimeString()
    }
    if (element.customFieldSpecialType == "Date & Time") {
      DateManual = this.myDT.toLocaleString();
    }
    if (element.customFieldSpecialType == "Date" || element.customFieldSpecialType == "") {
      DateManual = this.myDT.toLocaleDateString()
    }
    this.dataColumnFilter.datevalue = DateManual;
  }
  chosenYearHandler(normalizedYear: Date, datepicker: OwlDateTimeComponent<Moment>) {
    debugger;
    this.dataColumnFilter.searchValue = normalizedYear;
    this.dataColumnFilter.datevalue = normalizedYear.getFullYear();
    datepicker.close();
  }

  chosenMonthHandler(
    normalizedMonth: Date,
    datepicker: OwlDateTimeComponent<Moment>
  ) {
    debugger;
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    this.dataColumnFilter.searchValue = normalizedMonth;
    this.dataColumnFilter.datevalue = monthNames[normalizedMonth.getMonth()];
    datepicker.close();
  }


  //  =========  Download File ========
  Download(type) {

    let sortCol = "PartName";
    let sortDir = "asc";
    debugger;
    this.libraryService.getAllPartWithPaging(this.selectedTenantId, this.authService.accessToken, this.pageIndex + 1, this.pageSize, sortCol, sortDir, this.searchFilterText, this.FilterArray)
      .pipe(finalize(() => {


      })).subscribe(result => {

        debugger;
        this.loadingRecords = false;
        this.ImportDataBind = [];
        this.allItems = [];

        this.allItems = result.entity.parts;
        this.length = result.entity.totalParts;

        for (let i = 0; i < this.allItems.length; i++) {
          let map = new Map<string, any>();
          for (let j = 0; j < this.tabulatorColumn.length; j++) {

            let keys = Object.keys(this.allItems[i])
            for (let key = 0; key < keys.length; key++) {

              if (keys[key] == this.tabulatorColumn[j].field) {

                map.set(this.tabulatorColumn[j].title, this.allItems[i][keys[key]])
              }

            }
            for (let k = 0; k < this.allItems[i].attributeFields.length; k++) {
              if (this.allItems[i].attributeFields[k].columnName == this.tabulatorColumn[j].field) {
                map.set(this.tabulatorColumn[j].title, this.allItems[i].attributeFields[k].columnValue)
              }
            }
            for (let k = 0; k < this.allItems[i].attributeFields.length; k++) {

              if (this.allItems[i].attributeFields[k].columnName == this.tabulatorColumn[j].field) {

                if (this.tabulatorColumn[j].datatype == "Date/Time") {
                  if (this.allItems[i].attributeFields[k].columnValue != "") {
                    this.myDT = new Date(this.allItems[i].attributeFields[k].columnValue)
                    let DateManual = this.myDT.toLocaleDateString();
                    if (this.tabulatorColumn[j].customFieldSpecialType == "Time") {
                      DateManual = this.myDT.toLocaleTimeString()
                    }
                    if (this.tabulatorColumn[j].customFieldSpecialType == "Date & Time") {
                      DateManual = this.myDT.toLocaleString();
                    }
                    if (this.tabulatorColumn[j].customFieldSpecialType == "Date") {
                      DateManual = this.myDT.toLocaleDateString()
                    }
                    map.set(this.tabulatorColumn[j].title, DateManual)
                  }
                  else {
                    map.set(this.tabulatorColumn[j].title, this.allItems[i].attributeFields[k].columnValue)
                  }
                }

              }
            }
          }

          let jsonObject = {};
          map.forEach((value, key) => {
            jsonObject[key] = value
          });

          this.ImportDataBind.push(jsonObject);
        }
        if (type == "Excel")
          this.downloadFile(this.ImportDataBind);
        else
          this.openPDF(this.ImportDataBind);
      });
  }
  downloadFile(data) {

    /* table id is passed over here */
    let element = data;
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }
  public openPDF(Data) {

    let headColumn = Object.keys(Data[0])
    let head = []
    let data = [];
    data.push(Data);
    head.push(headColumn);
    var doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('My PDF Table', 11, 8);
    doc.setFontSize(11);
    doc.setTextColor(100);



    (doc as any).autoTable({
      body: Data,
      theme: 'plain',
      didDrawCell: data => {
        console.log(data.column.index)
      }
    })

    // Open PDF document in new tab
    doc.output('dataurlnewwindow')

    // Download PDF document  
    doc.save('table.pdf');
  }
}

