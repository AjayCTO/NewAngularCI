import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import toggle from '../../../../assets/js/lib/_toggle';
import inputClear from '../../../../assets/js/lib/_inputClear';
import { AppState } from '../../../shared/appState';
import { select, Store } from '@ngrx/store';
import { selectSelectedTenantId, selectSelectedTenant } from '../../../store/selectors/tenant.selectors';
import { CommanSharedService } from '../../../shared/service/comman-shared.service';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/auth.service';
import { DataColumnFilter1 } from '../../../currentinventory/models/admin.models';
import { ToastrService } from 'ngx-toastr';
import { from, Observable } from 'rxjs';
import { CustomFieldService } from '../../../customfield/service/custom-field.service';
import { EventService } from '../../../dynamic-events/service/event.service';
import { ReportService } from '../../service/report.service';
import { LibraryService } from '../../../library/service/library.service';
import { Router } from '@angular/router';
import { threadId } from 'worker_threads';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  DateTimeAdapter,
  OWL_DATE_TIME_FORMATS,
  OWL_DATE_TIME_LOCALE,
  OwlDateTimeComponent,
  OwlDateTimeFormats
} from 'ng-pick-datetime';
import * as _moment from "moment";
import { Moment } from "moment";
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from 'ngx-spinner';

const moment = (_moment as any).default ? (_moment as any).default : _moment;
@Component({
  selector: 'app-event-report',
  templateUrl: './event-report.component.html',
  styleUrls: ['./event-report.component.scss']
})
export class EventReportComponent implements OnInit {
  public myDT: Date;
  public selectedTenantId: number;
  public searchFilterText: string;
  public selectReport: number;
  public busy: boolean;
  public report: any
  public creatReportOpen = false;
  public uomList: any[];
  public startDate: string;
  public endDate: string;
  public ImportDataBind: any;
  public ColumnDataTypeSpecial: string
  public EditReport: boolean = false;
  public EventList: any;
  public Reportdata: any;
  public selectedRepotTitle: string;
  public isSearchFilterActive: boolean = false;
  public mainColumn: [];
  public FilterArray: any[] = [];
  public Month = [{ 'id': '1', 'month': 'Janurary' }, { 'id': '2', 'month': 'February' }, { 'id': '3', 'month': 'March' }, { 'id': '4', 'month': 'April' }, { 'id': '5', 'month': 'May' }, { 'id': '6', 'month': 'June' }, { 'id': '7', 'month': 'July' }, { 'id': '8', 'month': 'August' }, { 'id': '9', 'month': 'September' }, { 'id': '10', 'month': 'October' }, { 'id': '11', 'month': 'November' }, { 'id': '12', 'month': 'December' },]
  public hour = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
  public minutes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
  public seconds = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
  public options = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
  public dataColumnFilter: any = {
    columnName: "",
    displayName: "",
    filterOperator: "",
    searchValue: "",
    ColumnDataType: "",
    type: ""
  }
  public Inventorytable: any;
  public tabulatorColumn: any = [];
  public tabulatorColumnCustomReport: any = [];
  public InventoryDataBind: any = [];
  public myInventoryField: Observable<any>;
  public allInventoryItems: any;
  public tabeldata: any = [{ 'ItemName': 'Shirt', 'ItemDescription': 'this is shirt', },
  { 'ItemName': 'T-Shirt', 'ItemDescription': 'this is Tshirt' }];
  fileName = 'EventReport.xlsx';
  public ReportList = []
  pageIndex = 0;
  lastPageIndex = 0;
  pageSize = 10;
  image = "https://assets.ajio.com/medias/sys_master/root/hff/h1b/16003868000286/rosso_fem_white_striped_regular_fit_shirt.jpg"
  length = 100;
  // public tabulatorColumn1: any = [{ 'title': 'Quantity', 'datatype': 'number' }, { 'title': 'UOM', 'datatype': 'stringUom' }, { 'title': 'Item Name', 'datatype': 'string' }, { 'title': 'Item Description', 'datatype': 'string' }, { 'title': 'Location', 'datatype': 'string' }, { 'title': 'Status', 'datatype': 'stringStatus' },];
  public tabulatorValue: any;
  public ColumnDataType: string;
  public CustomFields: any;

  constructor(private libraryService: LibraryService, private spinner: NgxSpinnerService, private commanService: CommanSharedService, protected store: Store<AppState>, private eventService: EventService, private authService: AuthService, private toastr: ToastrService, private reportService: ReportService, private customfieldservice: CustomFieldService, private cdr: ChangeDetectorRef, private commanShardService: CommanSharedService) { }

  ngOnInit(): void {
    this.searchFilterText = "";
    this.selectedRepotTitle = "Default Event";
    if (localStorage.getItem("ReportCustomTitle") != undefined) {
      this.selectedRepotTitle = localStorage.getItem("ReportCustomTitle");
      localStorage.removeItem("ReportCustomTitle");
    }
    this.store.pipe(select(selectSelectedTenantId)).
      subscribe(eventId => {
        if (eventId) {

          this.selectedTenantId = eventId;
        }
        this.cdr.detectChanges();
      });
    toggle();

    this.selectReport = 1;
    this.GetEvents();
    this.getCustomreportList();
    this.GetMyInventoryColumn();
    this.SelectedNewCustomReport();
    // this.GetCustomFields();
    this.getUOMList();
    setTimeout(function () {
      toggle();
      inputClear();
      inputFocus();
    }, 1500);
    // toggle();
    // inputClear();
    // inputFocus();


  }
  getUOMList() {
    this.libraryService.GetUOM(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
        // this.spinner.hide();
      })).subscribe(result => {
        this.uomList = result.entity;
      })
  }
  CreateReport() {
    this.creatReportOpen = true;
  }


  SelectedReport(report) {

    this.selectedRepotTitle = report.reportTitle;
    let data = JSON.parse(report.columnFilterJsonSettings);
    if (data.length != 0) {
      this.tabulatorColumn = [];
      this.FilterArray = [];

      data.forEach(element => {
        this.dataColumnFilter = {
          columnName: "",
          displayName: "",
          filterOperator: "",
          searchValue: "",
          ColumnDataType: "",
          type: ""
        }
        this.tabulatorColumn.push({ title: element.ColumnLabel, field: element.ColumnName, type: element.Type, ColumnOperator: element.ColumnOperator, customFieldSpecialType: element.CustomFieldSpecialType, datatype: element.Datatype, width: element.Width });
        if (element.ColumnValue != "" && element.ColumnValue != null) {
          this.dataColumnFilter.columnName = element.Type == '' ? element.ColumnName : "$." + element.ColumnName;
          this.dataColumnFilter.displayName = element.ColumnLabel;
          this.dataColumnFilter.filterOperator = element.ColumnOperator;
          this.dataColumnFilter.searchValue = element.ColumnValue;
          this.dataColumnFilter.ColumnDataType = element.ColumnDataType;
          this.dataColumnFilter.type = element.Type;

          this.FilterArray.push(this.dataColumnFilter);
        }
      });
    }
    this.GetReport();
  }

  RemoveFilter(data) {
    this.FilterArray.forEach((element, index) => {

      if (element.columnName == data.columnName) {
        this.FilterArray.splice(index, 1);
      }

    });
    this.tabulatorColumn.forEach(element => {
      if (element.field == data.columnName) {
        element.inFilter = false;
      }
    });

    this.GetReport();
    setTimeout(function () {
      toggle();
      inputClear();
      inputFocus();
    }, 1500);
  }

  getCustomreportList() {


    this.reportService.GetCustomReportList(this.selectedTenantId, this.authService.accessToken).subscribe((result => {
      if (result.code == 200) {

        this.ReportList = result.entity;

      }

    }))
  }
  SearchFilter() {


    if (this.searchFilterText != undefined && this.searchFilterText != "") {
      this.isSearchFilterActive = true;
      this.GetReport();
      // this.ApplyJsFunction();
    }
  }
  RemoveSearchFilter() {

    // this.IsInventoryLoaded = false;
    this.isSearchFilterActive = false;
    this.searchFilterText = ""
    this.GetReport();
    // this.ApplyJsFunction();
  }
  DefaultView() {
    this.selectedRepotTitle = "Default Event"
    this.FilterArray = []
    this.GetEvents();
    this.getCustomreportList();
    this.GetMyInventoryColumn();
    // window.location.reload();
  }
  GetEvents() {

    this.eventService.GetEvents(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
      })).subscribe(result => {

        if (result.entity != null) {

          this.EventList = result.entity;
        }

      })
  }

  GetMyInventoryColumn() {

    this.tabulatorColumn = [];
    this.commanService.GetMyInventoryColumns(this.selectedTenantId, this.authService.accessToken).pipe(finalize(() => {
      this.busy = false;
      this.spinner.hide();
    })).subscribe(result => {
      this.mainColumn = [];
      // this.tabulatorColumn.push({ title: "Image", field: "image", type: "", datatype: "string", width: "170", id: "000", isAdded: true });
      // this.tabulatorColumn.push({ title: "Item Name", field: "partName", type: "", datatype: "string", width: "170", id: "001", isAdded: true });
      // this.tabulatorColumn.push({ title: "Description", field: "partDescription", type: "", datatype: "string", width: "450", id: "002", isAdded: true });
      // this.tabulatorColumn.push({ title: "Quantity", field: "quantity", type: "", datatype: "number", width: "170", id: "006", isAdded: true });
      // this.tabulatorColumn.push({ title: "UOM", field: "uomName", type: "", datatype: "stringUom", width: "170", id: "004", isAdded: true });
      // this.tabulatorColumn.push({ title: "Last Event", field: "lastAction", type: "", datatype: "string", width: "170", id: "005", isAdded: true });
      if (result.entity != null) {

        this.myInventoryField = result.entity;
        this.myInventoryField.forEach((element) => {
          if (element.customeFieldType != "AttributeField" && element.customeFieldType != "Inventory")
            this.tabulatorColumn.push({ id: element.columnId, title: element.columnLabel, isAdded: true, field: element.columnName, type: element.customeFieldType, customFieldSpecialType: element.customFieldSpecialType, datatype: element.dataType, width: element.columnWidth });
        });
        this.mainColumn = this.tabulatorColumn;
        this.GetReport()
      }
      else {
      }
      // this.tabulatorColumn.push({ title: "Location", field: "locationName", type: "", datatype: "string", width: "170", id: "003", isAdded: true });

      // this.store.dispatch(new SetDefaultInventoryColumn(this.tabulatorColumn));
      // localStorage.setItem('tabelColumn', JSON.stringify(this.tabulatorColumn));

    })
  }


  GetCustomFields() {

    this.customfieldservice.GetCustomFields(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {

      })).subscribe(result => {
        this.CustomFields = [];
        if (result.code == 200) {

          // this.CustomFields = result.entity;
          this.mainColumn = [];
          this.tabulatorColumn.push({ title: "Item Name", field: "partName", type: "", datatype: "string", width: "170" });
          this.tabulatorColumn.push({ title: "Description", field: "partDescription", type: "", datatype: "string", width: "450" });
          this.tabulatorColumn.push({ title: "Type of Event", field: "action", type: "", datatype: "special", width: "170" });
          this.tabulatorColumn.push({ title: "Date of Event", field: "transactionDate", type: "", customFieldSpecialType: "Date", datatype: "Date/Time", width: "170" });
          this.tabulatorColumn.push({ title: "Change in Qty", field: "transactionQtyChange", type: "", datatype: "number", width: "170" });
          this.tabulatorColumn.push({ title: "Location", field: "locationName", type: "", datatype: "string", width: "170" });
          this.tabulatorColumn.push({ title: "UOM", field: "uomName", type: "", datatype: "stringUom", width: "170" });

          if (result.entity != null) {
            this.myInventoryField = result.entity;
            this.myInventoryField.forEach(element => {

              this.tabulatorColumn.push({ title: element.columnLabel, field: element.columnName, type: element.customFieldType, customFieldSpecialType: element.customFieldSpecialType, datatype: element.dataType, width: "170" });

            });
          }
          this.mainColumn = this.tabulatorColumn;
          this.GetReport()

        }
      })
  }

  Download(type) {
    let sortCol = "PartName";
    let sortDir = "asc";
    this.commanShardService.GetEventReport(this.selectedTenantId, this.authService.accessToken, this.pageIndex + 1, 2000, sortCol, sortDir, this.startDate, this.endDate, this.searchFilterText, this.FilterArray)
      .pipe(finalize(() => {
      })).subscribe(result => {


        this.ImportDataBind = [];
        this.allInventoryItems = [];
        this.allInventoryItems = result.entity.transactionHistory;
        this.length = result.entity.totalItems;
        for (let i = 0; i < this.allInventoryItems.length; i++) {
          let map = new Map<string, any>();
          for (let j = 0; j < this.tabulatorColumn.length; j++) {
            let keys = Object.keys(this.allInventoryItems[i])
            for (let key = 0; key < keys.length; key++) {
              if (keys[key] == this.tabulatorColumn[j].field) {
                if (keys[key] == "transactionDate") {
                  this.myDT = new Date(this.allInventoryItems[i][keys[key]])
                  let DateManual = this.myDT.toLocaleDateString();
                  map.set(this.tabulatorColumn[j].title, DateManual)
                }
                else {
                  map.set(this.tabulatorColumn[j].title, this.allInventoryItems[i][keys[key]])
                }
              }
              else {
                if (keys[key] == "transactionDate") {
                  this.myDT = new Date(this.allInventoryItems[i][keys[key]])
                  let DateManual = this.myDT.toLocaleDateString();
                  map.set("Date of Event", DateManual)
                }
                // else {
                //   map.set(keys[key], this.allInventoryItems[i][keys[key]])
                // }

              }
            }
            for (let k = 0; k < this.allInventoryItems[i].customFields.length; k++) {

              if (this.allInventoryItems[i].customFields[k].columnName == this.tabulatorColumn[j].field) {
                map.set(this.tabulatorColumn[j].title, this.allInventoryItems[i].customFields[k].columnValue)
              }
            }
            for (let k = 0; k < this.allInventoryItems[i].customFields.length; k++) {

              if (this.allInventoryItems[i].customFields[k].columnName == this.tabulatorColumn[j].field) {

                if (this.tabulatorColumn[j].datatype == "Date/Time") {
                  if (this.allInventoryItems[i].customFields[k].columnValue != "") {
                    this.myDT = new Date(this.allInventoryItems[i].customFields[k].columnValue)
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
                    map.set(this.tabulatorColumn[j].title, this.allInventoryItems[i].customFields[k].columnValue);
                  }
                }
                else {
                  map.set(this.tabulatorColumn[j].title, this.allInventoryItems[i].customFields[k].columnValue)
                }
              }
            }


            // map.set("isSelected", false);
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

    //   console.log(this.exportdata)
    // }),

    error => console.log("Error downloading the file.")
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

  showDropDown = false;
  toggleDropDown() {
    debugger
    this.showDropDown = !this.showDropDown;

  }

  mainToggleDropdown = false;
  MainFilterToggle() {
    this.mainToggleDropdown = !this.mainToggleDropdown;
  }

  toggleGlobalDropDown(event) {

    this.tabulatorColumn.forEach(element => {
      if (element.field == event) {
        this.ColumnDataType = element.datatype;
        element.opentoggleDropdown = !element.opentoggleDropdown;
      }
    });
    setTimeout(function () {
      inputClear();
      inputFocus();
    }, 200);
  }



  closeDropDown() {
    debugger
    this.showDropDown = false;
  }

  getValue(value: boolean) {
    const html = document.querySelector('html');
    html.classList.remove('js-modal-page');
    this.creatReportOpen = false;
  }
  gotoFirstPage() {
    this.pageIndex = 0;
    this.GetReport();
    // this.ApplyJsFunction();
  }
  gotoLastPage() {

    this.pageIndex = this.length / this.pageSize;
    this.pageIndex = parseInt(this.pageIndex.toString())
    this.GetReport();
    // this.ApplyJsFunction();
  }
  UpdateSelectedReport() {

    this.EditReport = false;
    this.showDropDown = !this.showDropDown;
    this.reportService.GetCustomReportList(this.selectedTenantId, this.authService.accessToken).subscribe((result => {
      if (result.code == 200) {

        this.ReportList = result.entity;
        this.ReportList.forEach(element => {
          if (element.reportTitle == this.selectedRepotTitle) {
            this.report = element
            this.SelectedReport(this.report)
          }
        }
        )
      }
    }))
  }
  gotoNext() {
    debugger
    this.lastPageIndex = this.length / this.pageSize;
    this.lastPageIndex = parseInt(this.lastPageIndex.toString())
    if (this.pageIndex != this.lastPageIndex) {
      this.pageIndex++;
      this.GetReport();

    }
  }
  gotoBack() {
    if (this.pageIndex > 0) {
      this.pageIndex = this.pageIndex - 1;
      this.GetReport();
    }
  }
  onOptionsSelected(event) {
    // send selected value
    this.tabulatorColumn.forEach(element => {

      if (element.field == event) {

        this.ColumnDataType = element.datatype;
        this.ColumnDataTypeSpecial = element.customFieldSpecialType
      }

    });

    setTimeout(function () {
      toggle();
      inputClear();
      inputFocus();
    }, 1500);

  }
  onOptionsSelected2(event) {

    this.tabulatorColumn.forEach(element => {

      if (element.field == event) {

        this.ColumnDataType = element.datatype;
      }
    });

    setTimeout(function () {
      toggle();
      inputFocus();
    }, 1500);

  }

  EditCustomReport(ReportData) {


    this.EditReport = true

    this.Reportdata = ReportData;
    //  this.Reportdata.columnFilterJsonSettings=Data

  }

  GetReport() {


    let sortCol = "PartName";
    let sortDir = "asc";

    this.commanShardService.GetEventReport(this.selectedTenantId, this.authService.accessToken, this.pageIndex + 1, this.pageSize, sortCol, sortDir, this.startDate, this.endDate, this.searchFilterText, this.FilterArray)
      .pipe(finalize(() => {
      })).subscribe(result => {


        this.InventoryDataBind = [];
        this.allInventoryItems = [];
        this.allInventoryItems = result.entity.transactionHistory;
        this.length = result.entity.totalItems;
        for (let i = 0; i < this.allInventoryItems.length; i++) {
          let map = new Map<string, any>();
          for (let j = 0; j < this.tabulatorColumn.length; j++) {
            let keys = Object.keys(this.allInventoryItems[i])
            for (let key = 0; key < keys.length; key++) {
              if (keys[key] == this.tabulatorColumn[j].field) {
                if (keys[key] == "transactionDate") {
                  this.myDT = new Date(this.allInventoryItems[i][keys[key]])
                  let DateManual = this.myDT.toLocaleDateString();
                  map.set(this.tabulatorColumn[j].field, DateManual)
                }
                else {
                  map.set(this.tabulatorColumn[j].field, this.allInventoryItems[i][keys[key]])
                }
              }
              else {
                if (keys[key] == "transactionDate") {
                  this.myDT = new Date(this.allInventoryItems[i][keys[key]])
                  let DateManual = this.myDT.toLocaleDateString();
                  map.set(keys[key], DateManual)
                }
                else {
                  map.set(keys[key], this.allInventoryItems[i][keys[key]])
                }

              }
            }
            for (let k = 0; k < this.allInventoryItems[i].customFields.length; k++) {

              if (this.allInventoryItems[i].customFields[k].columnName == this.tabulatorColumn[j].field) {
                map.set(this.tabulatorColumn[j].field, this.allInventoryItems[i].customFields[k].columnValue)
              }
            }
            // for (let k = 0; k < this.allInventoryItems[i].transactionDate; k++) {
            //   
            //   this.myDT = new Date(this.allInventoryItems[i].transactionDate)
            //   let DateManual = this.myDT.toLocaleDateString();
            //   map.set(this.allInventoryItems[i].transactionDate, DateManual)
            // }
            for (let k = 0; k < this.allInventoryItems[i].customFields.length; k++) {

              if (this.allInventoryItems[i].customFields[k].columnName == this.tabulatorColumn[j].field) {

                if (this.tabulatorColumn[j].datatype == "Date/Time") {
                  if (this.allInventoryItems[i].customFields[k].columnValue != "") {
                    this.myDT = new Date(this.allInventoryItems[i].customFields[k].columnValue)
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
                    map.set(this.tabulatorColumn[j].field, this.allInventoryItems[i].customFields[k].columnValue);
                  }
                }
                else {
                  map.set(this.tabulatorColumn[j].field, this.allInventoryItems[i].customFields[k].columnValue)
                }
              }
            }


            map.set("isSelected", false);
          }
          let jsonObject = {};
          map.forEach((value, key) => {
            jsonObject[key] = value
          });
          this.InventoryDataBind.push(jsonObject);
        }

        // this.loadingRecords = false;
        // this.IsInventoryLoaded = true;
        // this.CheckboxShow = true;
        setTimeout(function () {
          toggle();
          inputClear();
          inputFocus();
        }, 1500);

      });
  }
  ClearAllFilter() {
    this.FilterArray = [];
    this.tabulatorColumn.forEach(element => {

      element.inFilter = false;

    });
    this.ngOnInit();
    // this.searchFilterText = "";
    // this.GetCurrentInventory();
    // this.ApplyJsFunction();
  }
  ConvertStringToDate(stringDate, Type) {

    this.myDT = new Date(stringDate);
    let DateManual = this.myDT.toLocaleDateString();
    if (Type == "Time") {
      DateManual = this.myDT.toLocaleTimeString()
    }
    if (Type == "Date & Time") {
      DateManual = this.myDT.toLocaleString();
    }
    if (Type == "date-eq") {


      DateManual = this.myDT.toLocaleDateString()
    }
    return DateManual;
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
    if (this.dataColumnFilter.type == "CustomField") {
      this.dataColumnFilter.columnName = "$." + this.dataColumnFilter.columnName;
    }
    this.dataColumnFilter = {
      columnName: "",
      displayName: "",
      filterOperator: "",
      searchValue: "",
      type: ""
    }



    // this.FilterArray.forEach((element, index) => {

    //   if (element.columnName == this.dataColumnFilter.columnName) {
    //     // return false;
    //     this.toastr.warning("This coloum name already in filter");

    //   }

    // });
    // this.tabulatorColumn.forEach(element => {
    //   if (element.field == this.dataColumnFilter.columnName) {
    //     this.dataColumnFilter.displayName = element.title;
    //     this.dataColumnFilter.type = element.type;
    //     element.inFilter = true;
    //   }
    // });
    // this.FilterArray.push(this.dataColumnFilter);
    // if (this.dataColumnFilter.type == "AttributeField" || this.dataColumnFilter.type == "StateField") {
    //   this.dataColumnFilter.columnName = "$." + this.dataColumnFilter.columnName;
    // }
    // this.dataColumnFilter = {
    //   columnName: "",
    //   displayName: "",
    //   filterOperator: "",
    //   searchValue: "",
    //   ColumnDataType: "",
    //   type: ""
    // }

    // document.getElementById("filterButton").click();
    this.mainToggleDropdown = false;
    this.GetReport();
    setTimeout(function () {
      toggle();
      inputClear();
      inputFocus();
    }, 1500);
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

      let pre = this.dataColumnFilter.type == "" ? '' : "$.";
      if (element.columnName == pre + this.dataColumnFilter.columnName) {
        this.FilterArray.splice(index, 1);
      }

    });

    this.FilterArray.push(this.dataColumnFilter);
    if (this.dataColumnFilter.type == "CustomField") {
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
    this.GetReport();
    setTimeout(function () {
      toggle();
      inputClear();
      inputFocus();
    }, 1500);


    // this.ApplyJsFunction();
  }
  FilterOperartorSelect(data) {

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
    if (data == 'Number Equal') {
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
  }
  CloseFilter2(columnName) {
    this.tabulatorColumn.forEach(element => {
      if (element.field == columnName) {

        element.opentoggleDropdown = !element.opentoggleDropdown

      }
    })

    // this.mainToggleDropdown = false;
    // document.getElementById("filterButton2_" + Id).click();
  }
  SelectedNewCustomReport() {
    this.reportService.GetCustomReportList(this.selectedTenantId, this.authService.accessToken).subscribe((result => {
      if (result.code == 200) {

        this.ReportList = result.entity;
        this.ReportList.forEach(element => {
          if (element.reportTitle == this.selectedRepotTitle) {
            this.report = element
            this.SelectedReport(this.report)
          }
        }
        )
      }
    }))
  }
  CloseFilter1() {
    this.mainToggleDropdown = false;
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

  }
  Close() {
    this.EditReport = false;
    this.showDropDown = !this.showDropDown;
    this.reportService.GetCustomReportList(this.selectedTenantId, this.authService.accessToken).subscribe((result => {
      if (result.code == 200) {

        this.ReportList = result.entity;
        this.ReportList.forEach(element => {
          if (element.reportTitle == this.selectedRepotTitle) {
            this.report = element
            this.SelectedReport(this.report)
          }
        }
        )
      }
    }))
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

    this.dataColumnFilter.searchValue = normalizedYear;
    this.dataColumnFilter.datevalue = normalizedYear.getFullYear();
    datepicker.close();
  }

  chosenMonthHandler(
    normalizedMonth: Date,
    datepicker: OwlDateTimeComponent<Moment>
  ) {

    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    this.dataColumnFilter.searchValue = normalizedMonth;
    this.dataColumnFilter.datevalue = monthNames[normalizedMonth.getMonth()];
    datepicker.close();
  }
}
