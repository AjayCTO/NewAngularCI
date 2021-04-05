import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import toggle from '../../../../assets/js/lib/_toggle';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import { AuthService } from '../../../core/auth.service';
import { AppState } from '../../../shared/appState';
import { select, Store } from '@ngrx/store';
import { finalize } from 'rxjs/operators';
import { selectSelectedTenantId, selectSelectedTenant } from '../../../store/selectors/tenant.selectors';
import { ReportService } from '../../service/report.service';
import { LibraryService } from '../../../library/service/library.service';
import { EventService } from '../../../dynamic-events/service/event.service';
import {
  DateTimeAdapter,
  OWL_DATE_TIME_FORMATS,
  OWL_DATE_TIME_LOCALE,
  OwlDateTimeComponent,
  OwlDateTimeFormats
} from 'ng-pick-datetime';
import * as _moment from "moment";
import { Moment } from "moment";
import { NgIf } from '@angular/common';
const moment = (_moment as any).default ? (_moment as any).default : _moment;
@Component({
  selector: 'app-editnew-custom-report',
  templateUrl: './editnew-custom-report.component.html',
  styleUrls: ['./editnew-custom-report.component.scss']
})
export class EditnewCustomReportComponent implements OnInit {

  @Input() Data: any;
  @Input() tabledata: any;
  @Input() ReportData: any;
  @Input() EventList: any;
  @Output() update = new EventEmitter();
  public selectedTenantId: number;
  public EditMode: boolean
  error: string;
  public myDT: Date;
  public toggleFilter: boolean;
  public busy: boolean;
  public columnFilters: any[] = [];
  public jsonobject: any;
  public deleteReport: boolean;
  public selectedId: number;
  public uomList: any[];
  public selectedFields: any = [];
  public tabulatorColumn: any[] = [];
  public tabulatorColumn1: any[] = [{ "field": "Ascending" }, { "field": "Descending" }];
  public tabulatorColumn2: any[] = [{ "id": 1, "field": "One" }, { "id": 2, "field": "Two" }, { "id": 3, "field": "Three" }, { "id": 4, "field": "Four" }];
  public Month = [{ 'id': '1', 'month': 'Janurary' }, { 'id': '2', 'month': 'February' }, { 'id': '3', 'month': 'March' }, { 'id': '4', 'month': 'April' }, { 'id': '5', 'month': 'May' }, { 'id': '6', 'month': 'June' }, { 'id': '7', 'month': 'July' }, { 'id': '8', 'month': 'August' }, { 'id': '9', 'month': 'September' }, { 'id': '10', 'month': 'October' }, { 'id': '11', 'month': 'November' }, { 'id': '12', 'month': 'December' },]
  public hour = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
  public minutes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
  public seconds = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
  public options = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
  public ReportList = []
  public customreport = {
    reportTitle: "",
    subTitle: "",
    description: "",
    reportType: "Event Report",
    ColumnFilter: [],
  }
  public dataColumnFilter: any = {
    columnName: "",
    displayName: "",
    filterOperator: "",
    searchValue: "",
    ColumnDataType: "",
    type: ""
  }
  public columnFilter: any = {
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columnFilters, event.previousIndex, event.currentIndex);
  }
  constructor(private libraryService: LibraryService, protected store: Store<AppState>, private eventService: EventService, private toast: ToastrService, private cdr: ChangeDetectorRef, private reportService: ReportService, private authService: AuthService) { }

  ngOnInit(): void {
    debugger;
    this.columnFilters.forEach(element => {

      // element.ColumnDataType = element.datatype;
      element.isAdded = true;


    });

    this.toggleFilter = false;
    this.EditMode = true;
    this.deleteReport = false;
    this.customreport.reportTitle = this.Data.reportTitle;
    this.customreport.description = this.Data.description;
    this.customreport.subTitle = this.Data.subTitle;
    let Data = JSON.parse(this.Data.columnFilterJsonSettings);
    debugger;
    this.columnFilters = Data;
    this.tabulatorColumn = this.tabledata
    this.store.pipe(select(selectSelectedTenantId)).
      subscribe(eventId => {
        if (eventId) {
          debugger;
          this.selectedTenantId = eventId;
        }

      });
    this.getUOMList();
    this.ApplyJsFunction();
  }
  ApplyJsFunction() {
    setTimeout(function () {
      toggle();
      inputClear();
      inputFocus();

    }, 200)
  }


  addRow() {
    debugger;
    this.columnFilter = {

    }
    this.columnFilters.push(this.columnFilter);
    this.ApplyJsFunction();
  }
  public OperatorFilterDateTime = [
    {
      name: "Equals",
      value: "date-eq",
      // src: "../../../../assets/img/filter/EqualTo.gif",
    },
    {
      name: "Date Between",
      value: "date-bw",
      // src: "../../../../assets/img/filter/EqualTo.gif",
    },
    {
      name: "Minute Equals",
      value: "date-minute",
      // src: "../../../../assets/img/filter/EqualTo.gif",
    },
    {
      name: "Hour Equals",
      value: "date-hour",
      // src: "../../../../assets/img/filter/EqualTo.gif",
    },
    {
      name: "Second Equals",
      value: "date-second",
      // src: "../../../../assets/img/filter/EqualTo.gif",
    },
    {
      name: "Month Equals",
      value: "date-month",
      // src: "../../../../assets/img/filter/EqualTo.gif",
    },
    {
      name: "Day Equals",
      value: "date-day",
      // src: "../../../../assets/img/filter/EqualTo.gif",
    },
    {
      name: "Year Equals",
      value: "date-year",
      // src: "../../../../assets/img/filter/EqualTo.gif",
    },
    {
      name: "On Or After",
      value: "date-after",
      // src: "../../../../assets/img/filter/EqualTo.gif",
    },
    {
      name: "On Or Before",
      value: "date-before",
      // src: "../../../../assets/img/filter/EqualTo.gif",
    },
    {
      name: "Is Empty",
      value: "Empty",
      // src: "../../../../assets/img/filter/EqualTo.gif",
    },


  ]
  public OperatorFilterTime = [
    {
      name: "Equals",
      value: "date-eq",
      // src: "../../../../assets/img/filter/EqualTo.gif",
    },

    {
      name: "Minute Equals",
      value: "date-minute",
      // src: "../../../../assets/img/filter/EqualTo.gif",
    },
    {
      name: "Hour Equals",
      value: "date-hour",
      // src: "../../../../assets/img/filter/EqualTo.gif",
    },
    {
      name: "Second Equals",
      value: "date-second",
      // src: "../../../../assets/img/filter/EqualTo.gif",
    },
    {
      name: "On Or After",
      value: "date-after",
      // src: "../../../../assets/img/filter/EqualTo.gif",
    },
    {
      name: "On Or Before",
      value: "date-before",
      // src: "../../../../assets/img/filter/EqualTo.gif",
    },
    {
      name: "Is Empty",
      value: "Empty",
      // src: "../../../../assets/img/filter/EqualTo.gif",
    },


  ]
  public OperatorFilterDate = [
    {
      name: "Equals",
      value: "date-eq",
      // src: "../../../../assets/img/filter/EqualTo.gif",
    },
    {
      name: "Date Between",
      value: "date-bw",
      // src: "../../../../assets/img/filter/EqualTo.gif",
    },
    {
      name: "Month Equals",
      value: "date-month",
      // src: "../../../../assets/img/filter/EqualTo.gif",
    },
    {
      name: "Day Equals",
      value: "date-day",
      // src: "../../../../assets/img/filter/EqualTo.gif",
    },
    {
      name: "Year Equals",
      value: "date-year",
      // src: "../../../../assets/img/filter/EqualTo.gif",
    },
    {
      name: "On Or After",
      value: "date-after",
      // src: "../../../../assets/img/filter/EqualTo.gif",
    },
    {
      name: "On Or Before",
      value: "date-before",
      // src: "../../../../assets/img/filter/EqualTo.gif",
    },
    {
      name: "Is Empty",
      value: "Empty",
      // src: "../../../../assets/img/filter/EqualTo.gif",
    },


  ]
  public OperatorFilterUOM = [
    {
      name: "Equals",
      value: "eq",
      src: "../../../../assets/img/filter/EqualTo.gif",
    },
    {
      name: "Not Equals",
      value: "ne",
      src: "../../../../assets/img/filter/NotEqualTo.gif",
    },

  ]
  public OperatorFilterString = [
    {
      name: "Contains",
      value: "cn",
      src: "../../../../assets/img/filter/Contains.gif",
    },
    {
      name: "Does Not Contains",
      value: "nc",
      src: "../../../../assets/img/filter/DoesNotContain.gif",
    },
    {
      name: "Equals",
      value: "eq",
      src: "../../../../assets/img/filter/EqualTo.gif",
    },
    {
      name: "Not Equals",
      value: "ne",
      src: "../../../../assets/img/filter/NotEqualTo.gif",
    },
    {
      name: "Begins With",
      value: "bw",
      src: "../../../../assets/img/filter/BeginsWith.gif",
    },
    {
      name: "Empty",
      value: "Empty",
      src: "../../../../assets/img/filter/IsNull.gif",
    },
  ]
  public OperatorFilterSpeacial = [
    {
      name: "Equals",
      value: "t-eq",
      src: "../../../../assets/img/filter/EqualTo.gif",
    },
    {
      name: "Not Equals",
      value: "t-ne",
      src: "../../../../assets/img/filter/NotEqualTo.gif",
    },
  ]
  public OperatorFilterNumber = [
    {
      name: "Equals",
      value: "num-eq",
    },
    {
      name: "Not Equals",
      value: "num-ne",

    },
    {
      name: "Greater Than OR Equals",
      value: "num-gte",

    },
    {
      name: "Less Than OR Equals",
      value: "num-lte",
    },
    {
      name: "Is Null(Empty)",
      value: "Empty",
    },
  ]
  removeForm(index) {
    debugger;
    this.columnFilters.splice(index, 1);
  }
  onOptionsSelected1(obj, event) {
    this.tabulatorColumn1.forEach(element => {
      if (element.field == event) {
        obj.SortType = element.datatype;

      }
    });
  }
  onOptionsSelected2(obj, event) {
    this.tabulatorColumn2.forEach(element => {
      if (element.field == event) {
        obj.SortOrder = element.datatype;

      }
    });
  }
  chosenMonthHandler(
    normalizedMonth: Date,
    datepicker: OwlDateTimeComponent<Moment>,
    name
  ) {
    debugger;
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    this.dataColumnFilter.searchValue = normalizedMonth;
    this.dataColumnFilter.datevalue = monthNames[normalizedMonth.getMonth()];
    this.columnFilters.forEach(element => {
      if (element.ColumnLabel == name) {

        element.ColumnValue = this.dataColumnFilter.datevalue
      }

    });
    datepicker.close();
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
  onOptionsSelected(obj, event) {
    debugger;
    this.tabulatorColumn.forEach(element => {
      if (element.field == event) {

        obj.ColumnDataType = element.datatype;
        obj.ColumnLabel = element.title;
        obj.columnName = element.field;
        obj.type = element.type;
        obj.datatype = element.datatype;
        obj.width = element.width;

      }
    });
    setTimeout(function () {
      inputClear();
      inputFocus();
    }, 500);
  }
  EditReport() {
    debugger;
    this.customreport.ColumnFilter = this.columnFilters;
    debugger;
    this.reportService.UpdateCustomReport(this.selectedTenantId, this.authService.accessToken, this.Data.id, this.customreport)
      .subscribe(result => {
        if (result.code == 200) {
          this.toast.success("Successfully Update");
          this.update.emit();
        }
        else if (result.code == 403) {
          this.toast.success("Can't Update");
        }
      },
        error => {
          this.error = error;

        });
  }
  selectedFilter = {
    country: "Equals", code: "date-eq"
  }
  toggleCountryCode: boolean = false;
  SelectFilter(item) {
    debugger;
    this.selectedFilter.code = item.value;
    this.selectedFilter.country = item.name;

    this.toggleCountryCode = false;
  }
  addColumn(a: any) {
    debugger;

    let IsExist = false;
    this.columnFilters.forEach(element => {


      if (element.ColumnLabel == a.title) {
        IsExist = true;
      }
    });
    if (!IsExist) {
      a.isSelected = true;
      a.ColumnLabel = a.title
      a.Datatype = a.datatype
      a.ColumnName = a.field
      this.columnFilters.push(a);
    }
    else {
      this.toast.warning("This Fields Already Have In Form");
    }
    this.cdr.detectChanges();
    // debugger;
    // this.onOptionsSelected(this.tabulatorColumn, e.dragData.ColumnName)
    setTimeout(function () {
      toggle();
      inputClear();
      inputFocus();
    }, 500);

    // this.onItemDrop(a)
  }
  onItemDrop(e: any) {
    // Get the dropped data here
    debugger;

    let IsExist = false;
    this.columnFilters.forEach(element => {


      if (element.ColumnLabel == e.dragData.title) {
        IsExist = true;
      }
    });
    if (!IsExist) {
      e.dragData.isSelected = true;
      e.dragData.ColumnLabel = e.dragData.title
      e.dragData.Datatype = e.dragData.datatype
      e.dragData.ColumnName = e.dragData.field
      // e.dragData.customFieldSpecialType = e.dragData.customFieldSpecialType
      this.columnFilters.push(e.dragData);
      this.toggleFilter = true;
    }
    else {
      this.toast.warning("This Fields Already Have In Form");
    }
    this.cdr.detectChanges();
    debugger;
    this.onOptionsSelected(this.tabulatorColumn, e.dragData.ColumnName)
    setTimeout(function () {
      inputClear();
      inputFocus();
    }, 500);
    // this.ApplyJsFunction();
  }
  DeleteConfirm() {
    debugger;
    this.selectedId = this.Data.id;
    this.deleteReport = true;
  }
  deleteValue(value: boolean) {
    const html = document.querySelector('html');
    html.classList.remove('js-modal-page');
    this.deleteReport = false;
  }
  DeleteReport() {
    debugger;

    this.reportService.DeleteCustomReport(this.selectedTenantId, this.Data.id, this.authService.accessToken)

      .subscribe(
        result => {
          debugger;
          if (result.code == 403) {
            this.toast.warning(result.message);
          }
          else {
            if (result) {
              this.toast.success("Successfully Delete.");
              window.location.reload();


            }
          }

        },
        error => {
          this.error = error;

        });
  }
  FilterOperartorSelect(data, event) {
    debugger;
    if (data == 'Equals') {
      this.columnFilters.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'eq'
        }
      });

    }
    if (data == 'Does Not Equal') {
      this.columnFilters.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'ne'
        }
      });

    }
    if (data == 'Contains') {
      this.columnFilters.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'cn'
        }
      });

    }
    if (data == 'Does NOT Contain') {
      this.columnFilters.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'nc'
        }
      });

    }
    if (data == 'Is Empty') {
      this.columnFilters.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'Empty'
        }
      });

    }
    if (data == 'Begins With') {
      this.columnFilters.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'bw'
        }
      });

    }
    if (data == 'Number Equals') {
      this.columnFilters.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'num-eq'
        }
      });

    }
    if (data == 'Number Not Equal') {
      this.columnFilters.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'num-ne'
        }
      });

    }
    if (data == 'Less Than or Equals') {
      this.columnFilters.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'num-lte'
        }
      });

    }
    if (data == 'Greater Than or Equals') {
      this.columnFilters.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'num-gte'
        }
      });

    }
    if (data == 'DateEquals') {
      this.columnFilters.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'date-eq'
        }
      });

    }
    if (data == 'TimeEquals') {
      this.columnFilters.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'time-eq'
        }
      });

    }
    if (data == 'Date Between') {
      this.columnFilters.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'date-bw'
        }
      });

    }
    if (data == 'Minute Equals') {
      this.columnFilters.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'date-minute'
        }
      });

    }
    if (data == 'Hour Equals') {
      this.columnFilters.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'date-hour'
        }
      });

    }
    if (data == 'Second Equals') {
      this.columnFilters.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'date-second'
        }
      });

    }
    if (data == 'Month Equals') {
      this.columnFilters.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'date-month'
        }
      });

    }
    if (data == 'Day Equals') {
      this.columnFilters.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'date-day'
        }
      });

    }
    if (data == 'Year Equals') {
      this.columnFilters.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'date-year'
        }
      });

    }
    if (data == 'On Or After') {
      this.columnFilters.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'date-after'
        }
      });

    }
    if (data == 'On Or Before') {
      this.columnFilters.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'date-before'
        }
      });

    }
  }
  RemoveFilter(data) {
    debugger;

    data.ColumnOperator = undefined;
    data.ColumnValue = '';
    this.columnFilters.forEach(element => {
      if (element.ColumnLabel == data.ColumnLabel) {
        // element.ColumnDataType = element.datatype;
        element.isAdded = false;
        element.opentoggleDropdown = false;
      }
    });

    this.ApplyJsFunction();
  }
  RemoveSort(data) {
    data.SortType = undefined;
    this.columnFilters.forEach(element => {
      if (element.ColumnLabel == data.ColumnLabel) {
        // element.ColumnDataType = element.datatype;
        element.isSortAdded = false;
        element.opentoggleDropdown = false;
      }
    });
  }
  toggleGlobalDropDown(event) {
    debugger;
    this.columnFilters.forEach(element => {
      if (element.ColumnLabel == event) {
        element.ColumnDataType = element.Datatype;
        // element.customFieldSpecialType = element.customFieldSpecialType;
        element.opentoggleDropdown = !element.opentoggleDropdown;
      }
    });


    this.ApplyJsFunction();
  }
  toggleGlobalDropDown1(event) {
    debugger;
    this.columnFilters.forEach(element => {
      if (element.ColumnLabel == event) {
        element.ColumnDataType = element.Datatype;
        element.opentoggleDropdown1 = !element.opentoggleDropdown1;
      }
    });


    this.ApplyJsFunction();
  }
  ApplySort(event) {
    this.columnFilters.forEach(element => {
      if (element.ColumnLabel == event) {
        // element.ColumnDataType = element.datatype;
        element.isSortAdded = true;
        element.opentoggleDropdown1 = !element.opentoggleDropdown1;
      }
    });
  }

  closeGlobalDropDown1(event) {
    debugger;
    this.columnFilters.forEach(element => {
      if (element.ColumnLabel == event) {
        // element.ColumnDataType = element.datatype;
        element.opentoggleDropdown1 = !element.opentoggleDropdown1;
      }
    });

  }

  ApplyFilter(event) {
    debugger;
    this.columnFilters.forEach(element => {
      if (element.ColumnLabel == event) {
        // element.ColumnDataType = element.datatype;
        element.isAdded = true;
        element.opentoggleDropdown = !element.opentoggleDropdown;
        if (element.datatype == "Date/Time") {
          let map = new Map<string, any>();
          element.ColumnValue = new Date(element.ColumnValue).toISOString()

          if (element.ColumnValue != "") {

            this.myDT = new Date(element.ColumnValue)
            let DateManual = this.myDT.toLocaleDateString();
            if (element.customFieldSpecialType == "Time") {
              DateManual = this.myDT.toLocaleTimeString()
            }
            if (element.customFieldSpecialType == "Date & Time") {
              DateManual = this.myDT.toLocaleString();
            }
            if (element.customFieldSpecialType == "Date") {
              DateManual = this.myDT.toLocaleDateString()
            }
            map.set(element.ColumnLabel, DateManual)
            element.ColumnValue = DateManual
          }
          else {
            map.set(element.ColumnLabel, element.columnValue);
          }
        }
      }
    });

    // this.closeGlobalDropDown(event)
    this.ApplyJsFunction();

  }
  closeGlobalDropDown(event) {
    this.RemoveFilter(event);


  }
  CloseFilter() {
    document.getElementById("filterButton").click();
  }

  Apply2() {
    debugger;
    document.getElementById("AsscFilter").click();
  }
  Cancel() {
    window.location.reload();
  }
  CloseEdit() {
    this.EditMode = false;
  }
  removeField(index) {
    debugger;
    this.columnFilters.splice(index, 1);

  }
}
