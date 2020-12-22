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
import action from '../../../../assets/js/lib/_action';
import trigger from '../../../../assets/js/lib/_trigger';
import dropdown from '../../../../assets/js/lib/_dropdown';
import { ToastrService } from 'ngx-toastr';
import { Form, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AttributeFields } from '../../../customfield/models/customfieldmodel';
import { Router, Routes } from '@angular/router';

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

  partformControl: FormGroup;
  public selectedTenantId: number;
  public error: string;
  public selecteditem: any = [];
  public busy: boolean;
  public DeleteConfirmPopup: boolean;
  public myInventoryField: Observable<any>;
  public tabulatorColumn: any = [];
  public Itemlist: any;
  public ColumnDataType: string;
  searchFilterText: string;
  public showForm: boolean;
  public NotPermitted: boolean = false;
  public selectedPartItem: any;

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

  public FilterArray: DataColumnFilter[] = [];
  public edititem: boolean;
  public dataColumnFilter: DataColumnFilter = {
    columnName: "",
    displayName: "",
    filterOperator: "cn",
    searchValue: "",
    type: ""
  }

  length = 100;
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
  public CfdcomboValuesDropDown: string;
  PreviewtypesDropDown: any = [];
  PreviewtypesAutocomplete: any = [];

  constructor(private router: Router, private formBuilder: FormBuilder, private toastr: ToastrService, private cdr: ChangeDetectorRef, private libraryService: LibraryService, private authService: AuthService,
    private spinner: NgxSpinnerService, private commanService: CommanSharedService,
    private customfieldservice: CustomFieldService) { }


  ngOnInit() {
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
    // this.ApplyDropdown();
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
    this.partformControl.reset();
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



  // ApplyDropdown() {
  //   setTimeout(() => {
  //     dropdown();
  //   }, 1500);
  // }
  onOptionsSelected(event) {
    // send selected value

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
  ClearAllFilter() {
    this.FilterArray = [];
    this.searchFilterText = "";
    // window.location.reload();
    this.GetParts();

  }
  onOptionsSelected2(event) {
    // send selected value

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

    this.FilterArray.forEach((element, index) => {

      if (element.columnName == this.dataColumnFilter.columnName) {
        return false;
        this.toastr.warning("This coloum name already in filter");

      }

    });
    this.tabulatorColumn.forEach(element => {
      if (element.field == this.dataColumnFilter.columnName) {
        this.dataColumnFilter.displayName = element.title;
        this.dataColumnFilter.type = element.type;
      }
    });
    this.FilterArray.push(this.dataColumnFilter);
    if (this.dataColumnFilter.type == "AttributeField" || this.dataColumnFilter.type == "StateField") {
      this.dataColumnFilter.columnName = "$." + this.dataColumnFilter.columnName;
    }
    this.dataColumnFilter = {
      columnName: "",
      displayName: "",
      filterOperator: "cn",
      searchValue: "",
      type: ""
    }
    document.getElementById("filterButton").click();
    // this.CloseFilter();
    this.GetParts();



  }
  RemoveFilter(data) {
    this.FilterArray.forEach((element, index) => {

      if (element.columnName == data.columnName) {
        this.FilterArray.splice(index, 1);
      }

    });
    this.GetParts();

  }
  CloseFilter() {

    document.getElementById("filterButton").click();

    // let el: HTMLElement = this.filterChange.nativeElement;
    // el.click();

    // window.location.reload();
  }
  ApplyFilter2(columnName) {

    this.dataColumnFilter.columnName = columnName;
    if (this.dataColumnFilter.columnName == "" || this.dataColumnFilter.filterOperator == "" || this.dataColumnFilter.searchValue == "") {
      return false;
    }

    this.FilterArray.forEach((element, index) => {

      if (element.columnName == this.dataColumnFilter.columnName) {

        this.toastr.warning("This coloum name already in filter");
        return false;
      }

    });
    this.tabulatorColumn.forEach(element => {
      if (element.field == this.dataColumnFilter.columnName) {
        this.dataColumnFilter.displayName = element.title;
        this.dataColumnFilter.type = element.type;
      }
    });
    this.FilterArray.push(this.dataColumnFilter);
    if (this.dataColumnFilter.type == "AttributeField" || this.dataColumnFilter.type == "StateField") {
      this.dataColumnFilter.columnName = "$." + this.dataColumnFilter.columnName;
    }
    this.dataColumnFilter = {
      columnName: "",
      displayName: "",
      filterOperator: "cn",
      searchValue: "",
      type: ""
    }
    document.getElementById("filterButton3_" + columnName).click();
    // document.getElementById("filterButton3_" + Id).click();
    this.GetParts();

  }

  CloseFilter2(Id) {
    document.getElementById("filterButton3_" + Id).click();
    // window.location.reload();

  }

  onSubmit() {
    debugger;
    this.submitted = true;
    if (this.partformControl.invalid) {
      this.toastr.warning("Required", "Please fill required column");
      return;
    }
    this.spinner.show();
    this.partForm = this.partformControl.value;
    this.AttributeFields.forEach(element => {

      element.columnValue = this.partformControl.value[element.columnId];
      if (element.customFieldPrefix != "" || element.customFieldSuffix != "") {
        element.columnValue = element.columnValue
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
              // element.columnValue = element.customFieldBaseValue;
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
            debugger;

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
        this.tabulatorColumn.push({ title: "Item Name", field: "partName", type: "", datatype: "string", width: "170" });
        this.tabulatorColumn.push({ title: "Description", field: "partDescription", type: "", datatype: "string", width: "450" });
        this.tabulatorColumn.push({ title: "Default Location", field: "locationName", type: "", datatype: "string", width: "170" });
        this.tabulatorColumn.push({ title: " Defualt UOM", field: "uomName", type: "", datatype: "stringUom", width: "170" });
        this.myInventoryField.forEach(element => {
          if (element.customeFieldType == "AttributeField") {
            this.tabulatorColumn.push({ title: element.columnLabel, field: element.columnName, type: element.customeFieldType, datatype: "string", width: "170" });
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
    debugger;
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
    debugger;

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
    debugger;
    this.libraryService.getAllPartWithPaging(this.selectedTenantId, this.authService.accessToken, this.pageIndex + 1, this.pageSize, sortCol, sortDir, this.searchFilterText, this.FilterArray)
      .pipe(finalize(() => {

        //this.spinner.hide();
      })).subscribe(result => {

        if (result.code == 403) {
          this.NotPermitted = true;
        }
        this.loadingRecords = false;
        this.PartDataBind = [];
        this.allItems = [];

        this.allItems = result.entity.parts;
        this.length = result.entity.totalParts;

        for (let i = 0; i < this.allItems.length; i++) {
          let map = new Map<string, string>();
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
                map.set(this.tabulatorColumn[j].field, this.allItems[i].attributeFields[k].columnValue)
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



  selectEvent(event, data) {
    debugger;
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
    debugger;
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
            debugger;

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
    debugger;


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
            debugger;

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
    form.reset();
  }
  // 
  edit(item) {
    debugger;
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
}

