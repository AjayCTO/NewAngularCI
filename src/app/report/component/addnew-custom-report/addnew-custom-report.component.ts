import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CustomFieldService } from '../../../customfield/service/custom-field.service';
import { finalize } from 'rxjs/operators';
// import { selectedFields } from '../../../currentinventory/models/admin.models';
import { AuthService } from '../../../core/auth.service';
import { from, Observable } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import { Router, ActivatedRoute } from '@angular/router';
import { ReportService } from '../../service/report.service';
import { EventService } from '../../../dynamic-events/service/event.service';
import { LibraryService } from '../../../library/service/library.service';
import modal from '../../../../assets/js/lib/_modal';
import toggle from '../../../../assets/js/lib/_toggle';

@Component({
  selector: 'app-addnew-custom-report',
  templateUrl: './addnew-custom-report.component.html',
  styleUrls: ['./addnew-custom-report.component.scss']
})
export class AddnewCustomReportComponent implements OnInit {
  public tabulatorColumn: any = [];
  public CustomFields;
  public myDT: Date;
  public selectedTenantId: number;
  public myInventoryField: Observable<any>;
  public busy: boolean;
  public EventList: any;
  public uomList: any[];
  public SimpleColumn: any = []
  public GroupCustomField: any = []
  public key = this.tabulatorColumn.type
  // public FilterArray: selectedFields[] = []
  public customreport = {
    reportTitle: "",
    subTitle: "",
    description: "",
    reportType: "Event Report",
    ColumnFilter: [],
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
  public Month = [{ 'id': '1', 'month': 'Janurary' }, { 'id': '2', 'month': 'February' }, { 'id': '3', 'month': 'March' }, { 'id': '4', 'month': 'April' }, { 'id': '5', 'month': 'May' }, { 'id': '6', 'month': 'June' }, { 'id': '7', 'month': 'July' }, { 'id': '8', 'month': 'August' }, { 'id': '9', 'month': 'September' }, { 'id': '10', 'month': 'October' }, { 'id': '11', 'month': 'November' }, { 'id': '12', 'month': 'December' },]
  public hour = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
  public minutes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
  public seconds = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
  public options = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']

  public selectedFields: any = [];
  public tabulatorColumn3: any[] = [{ "field": "Ascending" }, { "field": "Descending" }];
  public tabulatorColumn2: any[] = [{ "id": 1, "field": "One" }, { "id": 2, "field": "Two" }, { "id": 3, "field": "Three" }, { "id": 4, "field": "Four" }];
  public columnFilter: any = {
    columnDataType: "string",
    columnName: "",
    conlumnLabel: "",
    ColumnOperator: "",
    columnValue: "",
    type: "",
    sortOrder: ""
  }



  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectedFields, event.previousIndex, event.currentIndex);
  }
  constructor(private libraryService: LibraryService, private customfieldservice: CustomFieldService, private router: Router, private eventService: EventService, private reportService: ReportService, private authService: AuthService, private toastr: ToastrService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    this.GetAllFields();
    this.GetEvents();
    this.getUOMList();
    this.ApplyJsFunction();
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
  ApplyJsFunction() {
    setTimeout(function () {
      modal();
      toggle();
      inputClear();
      inputFocus();
      // datePicker();
    }, 2500)
  }
  onOptionsSelected2(obj, event) {
    this.tabulatorColumn3.forEach(element => {

      if (element.field == event) {

        obj.SortOrder = element.datatype;

      }
    });

  }
  RemoveFilter(data) {
    debugger;

    data.ColumnOperator = undefined;
    data.ColumnValue = '';
    this.selectedFields.forEach(element => {
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
    this.selectedFields.forEach(element => {
      if (element.ColumnLabel == data.ColumnLabel) {
        // element.ColumnDataType = element.datatype;
        element.isSortAdded = false;
        element.opentoggleDropdown = false;
      }
    });
  }
  FilterOperartorSelect(data, event) {
    debugger;
    if (data == 'Equals') {
      this.selectedFields.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'eq'
        }
      });

    }
    if (data == 'Does Not Equal') {
      this.selectedFields.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'ne'
        }
      });

    }
    if (data == 'Contains') {
      this.selectedFields.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'cn'
        }
      });

    }
    if (data == 'Does NOT Contain') {
      this.selectedFields.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'nc'
        }
      });

    }
    if (data == 'Is Empty') {
      this.selectedFields.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'Empty'
        }
      });

    }
    if (data == 'Begins With') {
      this.selectedFields.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'bw'
        }
      });

    }
    if (data == 'Number Equals') {
      this.selectedFields.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'num-eq'
        }
      });

    }
    if (data == 'Number Not Equal') {
      this.selectedFields.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'num-ne'
        }
      });

    }
    if (data == 'Less Than or Equals') {
      this.selectedFields.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'num-lte'
        }
      });

    }
    if (data == 'Greater Than or Equals') {
      this.selectedFields.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'num-gte'
        }
      });

    }
    if (data == 'DateEquals') {
      this.selectedFields.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'date-eq'
        }
      });

    }
    if (data == 'TimeEquals') {
      this.selectedFields.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'time-eq'
        }
      });

    }
    if (data == 'Date Between') {
      this.selectedFields.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'date-bw'
        }
      });

    }
    if (data == 'Minute Equals') {
      this.selectedFields.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'date-minute'
        }
      });

    }
    if (data == 'Hour Equals') {
      this.selectedFields.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'date-hour'
        }
      });
    }
    if (data == 'Second Equals') {
      this.selectedFields.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'date-second'
        }
      });
    }
    if (data == 'Month Equals') {
      this.selectedFields.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'date-month'
        }
      });
    }
    if (data == 'Day Equals') {
      this.selectedFields.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'date-day'
        }
      });
    }
    if (data == 'Year Equals') {
      this.selectedFields.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'date-year'
        }
      });
    }
    if (data == 'On Or After') {
      this.selectedFields.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'date-after'
        }
      });
    }
    if (data == 'On Or Before') {
      this.selectedFields.forEach(element => {
        if (element.ColumnLabel == event) {
          element.ColumnOperator = 'date-before'
        }
      });
    }
  }
  ApplyFilter(event) {
    debugger;
    this.selectedFields.forEach(element => {
      if (element.ColumnLabel == event) {
        element.isAdded = true;
        element.opentoggleDropdown = !element.opentoggleDropdown;
        let map = new Map<string, any>();
        element.ColumnValue = new Date(element.ColumnValue).toISOString()
        if (element.datatype == "Date/Time") {
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
    this.ApplyJsFunction();
  }
  ApplySort(event) {
    this.selectedFields.forEach(element => {
      if (element.ColumnLabel == event) {
        element.isSortAdded = true;
        element.opentoggleDropdown1 = !element.opentoggleDropdown1;
      }
    });
  }

  closeGlobalDropDown1(event) {
    this.selectedFields.forEach(element => {
      if (element.ColumnLabel == event) {
        element.opentoggleDropdown1 = !element.opentoggleDropdown1;
      }
    });

  }
  closeGlobalDropDown(event) {
    this.RemoveFilter(event);
  }
  removeField(index) {
    debugger;
    this.selectedFields.splice(index, 1);
  }
  CloseFilter() {
    document.getElementById("filterButton").click();
  }
  onOptionsSelected1(obj, event) {
    debugger;
    this.tabulatorColumn3.forEach(element => {
      if (element.field == event) {
        obj.SortType = element.datatype;
      }
    });

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
  GetAllFields() {
    debugger;
    this.customfieldservice.GetCustomFields(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
      })).subscribe(result => {
        this.CustomFields = [];
        if (result.code == 200) {
          debugger;
          this.tabulatorColumn.push({ columnDataType: "string", ColumnLabel: "Item Name", ColumnName: "partName", type: "", datatype: "string", width: "170" });
          this.tabulatorColumn.push({ columnDataType: "string", ColumnLabel: "Description", ColumnName: "partDescription", type: "", datatype: "string", width: "450" });
          this.tabulatorColumn.push({ columnDataType: "special", ColumnLabel: "Type of Event", ColumnName: "action", type: "", datatype: "special", width: "170" });
          this.tabulatorColumn.push({ columnDataType: "Date/Time", ColumnLabel: "Date of Event", ColumnName: "transactionDate", type: "", datatype: "Date/Time", customFieldSpecialType: "Date & Time", width: "170" });
          this.tabulatorColumn.push({ columnDataType: "number", ColumnLabel: "Change in Qty", ColumnName: "transactionQtyChange", type: "", datatype: "number", width: "170" });
          this.tabulatorColumn.push({ columnDataType: "string", ColumnLabel: "location", ColumnName: "locationName", type: "", datatype: "string", width: "170" });
          this.tabulatorColumn.push({ columnDataType: "stringUom", ColumnLabel: "UOM", ColumnName: "uomName", type: "", datatype: "stringUom", width: "170" });
          if (result.entity != null) {
            this.myInventoryField = result.entity;
            this.myInventoryField.forEach(element => {
              this.tabulatorColumn.push({ customFieldSpecialType: element.customFieldSpecialType, columnDataType: element.dataType, ColumnLabel: element.columnLabel, ColumnName: element.columnName, type: element.customFieldType, datatype: element.dataType, width: "170" });
            });
          }
        }
      })
  }



  Apply2() {
    debugger;
    document.getElementById("SortClose").click();
  }
  CloseSort() {
    document.getElementById("SortClose").click();
  }

  groupBy(key) {
    debugger;
    return function group(array) {
      return this.tabulatorColumn.reduce((acc, obj) => {
        const property = obj[key];
        acc[property] = acc[property] || [];
        acc[property].push(obj);
        return acc;
      }, {});
    };
  }

  toggleGlobalDropDown(event) {
    debugger;
    this.selectedFields.forEach(element => {
      if (element.ColumnLabel == event) {
        element.ColumnDataType = element.datatype;
        element.opentoggleDropdown = !element.opentoggleDropdown;
      }
    });


    this.ApplyJsFunction();
  }
  toggleGlobalDropDown1(event) {
    debugger;
    this.selectedFields.forEach(element => {
      if (element.ColumnLabel == event) {
        element.ColumnDataType = element.datatype;
        element.opentoggleDropdown1 = !element.opentoggleDropdown1;
      }
    });


    this.ApplyJsFunction();
  }
  addColumn(a: any) {
    debugger;

    let IsExist = false;
    this.selectedFields.forEach(element => {


      if (element.ColumnLabel == a.ColumnLabel) {
        IsExist = true;
      }
    });
    if (!IsExist) {
      a.isSelected = true;
      this.selectedFields.push(a);
    }
    else {
      this.toastr.warning("this fields already have in Form ");
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
    this.selectedFields.forEach(element => {


      if (element.ColumnLabel == e.dragData.ColumnLabel) {
        IsExist = true;
      }
    });
    if (!IsExist) {
      e.dragData.isSelected = true;
      e.dragData.CustomFieldSpecialType = e.dragData.customFieldSpecialType
      this.selectedFields.push(e.dragData);
    }
    else {
      this.toastr.warning("this fields already have in Form ");
    }
    this.cdr.detectChanges();
    // debugger;
    // this.onOptionsSelected(this.tabulatorColumn, e.dragData.ColumnName)
    setTimeout(function () {
      toggle();
      inputClear();
      inputFocus();
    }, 500);
    // this.ApplyJsFunction();
  }

  save() {

    // this.columnFilter.ColumnLabel = this.selectedFields.title;
    this.customreport.ColumnFilter = this.selectedFields;
    debugger;
    this.reportService.AddCustomReport(this.selectedTenantId, this.authService.accessToken, this.customreport).subscribe((result => {

      if (result.code == 200) {
        this.toastr.success("your report is Added")
        this.router.navigate(['/report/event-report']);
      }
    }))
  }
}
