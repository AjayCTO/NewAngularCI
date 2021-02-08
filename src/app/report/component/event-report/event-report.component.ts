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
import { Router } from '@angular/router';
import { threadId } from 'worker_threads';
@Component({
  selector: 'app-event-report',
  templateUrl: './event-report.component.html',
  styleUrls: ['./event-report.component.scss']
})
export class EventReportComponent implements OnInit {

  public selectedTenantId: number;
  public searchFilterText: string;
  public selectReport: number;
  public busy: boolean;
  public creatReportOpen = false;
  public startDate: string;
  public endDate: string;
  public EditReport: boolean = false;
  public EventList: any;
  public Reportdata: any;
  public selectedRepotTitle: string;
  public isSearchFilterActive: boolean = false;
  public mainColumn: [];
  public FilterArray: DataColumnFilter1[] = [];
  public dataColumnFilter: DataColumnFilter1 = {
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

  constructor(protected store: Store<AppState>, private eventService: EventService, private authService: AuthService, private toastr: ToastrService, private reportService: ReportService, private customfieldservice: CustomFieldService, private cdr: ChangeDetectorRef, private commanShardService: CommanSharedService) { }

  ngOnInit(): void {
    this.searchFilterText = "";
    this.selectedRepotTitle = "Default Event";
    this.store.pipe(select(selectSelectedTenantId)).
      subscribe(eventId => {
        if (eventId) {
          debugger;
          this.selectedTenantId = eventId;
        }
        this.cdr.detectChanges();
      });


    this.selectReport = 1;
    this.GetEvents();
    this.getCustomreportList();
    this.GetCustomFields();
    inputClear();
    inputFocus();
    toggle();

  }
  CreateReport() {
    this.creatReportOpen = true;
  }


  SelectedReport(report) {
    debugger;
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
        this.tabulatorColumn.push({ title: element.ColumnLabel, field: element.ColumnName, type: element.Type, datatype: element.Datatype, width: "170" });
        if (element.ColumnValue != "" && element.ColumnValue != null) {
          this.dataColumnFilter.columnName = element.ColumnName;
          this.dataColumnFilter.displayName = element.ColumnLabel;
          this.dataColumnFilter.filterOperator = element.ColumnOperator;
          this.dataColumnFilter.searchValue = element.ColumnValue;
          this.dataColumnFilter.ColumnDataType = element.ColumnDataType;
          this.dataColumnFilter.type = element.SortType;

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

    this.GetReport();
    setTimeout(function () {
      toggle();
      inputClear();
      inputFocus();
    }, 500);
  }

  getCustomreportList() {

    debugger;
    this.reportService.GetCustomReportList(this.selectedTenantId, this.authService.accessToken).subscribe((result => {
      if (result.code == 200) {
        debugger;
        this.ReportList = result.entity;

      }

    }))
  }
  SearchFilter() {
    debugger;

    if (this.searchFilterText != undefined && this.searchFilterText != "") {
      this.isSearchFilterActive = true;
      this.GetReport();
      // this.ApplyJsFunction();
    }
  }
  RemoveSearchFilter() {
    debugger;
    // this.IsInventoryLoaded = false;
    this.isSearchFilterActive = false;
    this.searchFilterText = ""
    this.GetReport();
    // this.ApplyJsFunction();
  }
  GetEvents() {
    debugger;
    this.eventService.GetEvents(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
      })).subscribe(result => {
        debugger;
        if (result.entity != null) {
          debugger;
          this.EventList = result.entity;
        }

      })
  }

  GetCustomFields() {
    debugger;
    this.customfieldservice.GetCustomFields(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {

      })).subscribe(result => {
        this.CustomFields = [];
        if (result.code == 200) {
          debugger;
          // this.CustomFields = result.entity;
          this.mainColumn = [];
          this.tabulatorColumn.push({ title: "Item Name", field: "partName", type: "", datatype: "string", width: "170" });
          this.tabulatorColumn.push({ title: "Description", field: "partDescription", type: "", datatype: "string", width: "450" });
          this.tabulatorColumn.push({ title: "Type of Event", field: "action", type: "", datatype: "special", width: "170" });
          this.tabulatorColumn.push({ title: "Date of Event", field: "transactionDate", type: "", datatype: "number", width: "170" });
          this.tabulatorColumn.push({ title: "Change in Qty", field: "transactionQtyChange", type: "", datatype: "number", width: "170" });
          this.tabulatorColumn.push({ title: "Location", field: "locationName", type: "", datatype: "string", width: "170" });
          this.tabulatorColumn.push({ title: "UOM", field: "uomName", type: "", datatype: "stringUom", width: "170" });

          if (result.entity != null) {
            this.myInventoryField = result.entity;
            this.myInventoryField.forEach(element => {

              this.tabulatorColumn.push({ title: element.columnLabel, field: element.columnName, type: element.customFieldType, datatype: element.dataType, width: "170" });

            });
          }
          this.mainColumn = this.tabulatorColumn;
          this.GetReport()

        }
      })
  }


  showDropDown = false;
  toggleDropDown() {
    debugger
    this.showDropDown = !this.showDropDown;

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
    // this.GetCurrentInventory();
    // this.ApplyJsFunction();
  }
  gotoLastPage() {

    this.pageIndex = this.length / this.pageSize;
    this.pageIndex = parseInt(this.pageIndex.toString())
    // this.GetCurrentInventory();
    // this.ApplyJsFunction();
  }
  gotoNext() {
    debugger
    this.lastPageIndex = this.length / this.pageSize;
    this.lastPageIndex = parseInt(this.lastPageIndex.toString())
    if (this.pageIndex != this.lastPageIndex) {
      this.pageIndex++;
      // this.GetCurrentInventory();
      // this.ApplyJsFunction();
    }
  }
  gotoBack() {
    if (this.pageIndex > 0) {
      this.pageIndex = this.pageIndex - 1;
      // this.GetCurrentInventory();
      // this.ApplyJsFunction();
    }
  }
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
    }, 500);

  }
  onOptionsSelected2(event) {
    debugger;
    this.tabulatorColumn.forEach(element => {

      if (element.field == event) {

        this.ColumnDataType = element.datatype;
      }
    });

    setTimeout(function () {

      inputFocus();
    }, 500);

  }

  EditCustomReport(ReportData) {

    debugger;
    this.EditReport = true

    this.Reportdata = ReportData;
    //  this.Reportdata.columnFilterJsonSettings=Data

  }

  GetReport() {

    debugger;
    let sortCol = "PartName";
    let sortDir = "asc";

    this.commanShardService.GetEventReport(this.selectedTenantId, this.authService.accessToken, this.pageIndex + 1, this.pageSize, sortCol, sortDir, this.startDate, this.endDate, this.searchFilterText, this.FilterArray)
      .pipe(finalize(() => {
      })).subscribe(result => {

        debugger;
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
                map.set(this.tabulatorColumn[j].field, this.allInventoryItems[i][keys[key]])
              }
              else {
                map.set(keys[key], this.allInventoryItems[i][keys[key]])
              }
            }
            for (let k = 0; k < this.allInventoryItems[i].customFields.length; k++) {
              if (this.allInventoryItems[i].customFields[k].columnName == this.tabulatorColumn[j].field) {
                map.set(this.tabulatorColumn[j].field, this.allInventoryItems[i].customFields[k].columnValue)
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
        toggle();
        inputClear();
        inputFocus();

      });
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
    if (this.dataColumnFilter.type == "AttributeField" || this.dataColumnFilter.type == "StateField" || this.dataColumnFilter.type == "CustomField") {
      this.dataColumnFilter.columnName = "$." + this.dataColumnFilter.columnName;
    }
    this.dataColumnFilter = {
      columnName: "",
      displayName: "",
      filterOperator: "",
      searchValue: "",
      ColumnDataType: "",
      type: ""
    }
    document.getElementById("filterButton2_" + columnName).click();
    this.GetReport();
    setTimeout(function () {
      toggle();
      inputClear();
      inputFocus();
    }, 500);


    // this.ApplyJsFunction();
  }

  CloseFilter2(Id) {
    debugger;
    document.getElementById("filterButton2_" + Id).click();
  }

}
