import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { CommanSharedService } from '../../../shared/service/comman-shared.service';
import { from, Observable } from 'rxjs';
import toggle from '../../../../assets/js/lib/_toggle';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import { AuthService } from '../../../core/auth.service';
import { finalize } from 'rxjs/operators';
import { ReportTable, DataColumnFilter } from '../../../currentinventory/models/admin.models';
// import { SetSelectedTenant, SetSelectedTenantId } from '../../../store/actions/tenant.action';
import { CustomFieldService } from '../../../customfield/service/custom-field.service';
import { EventService } from '../../../dynamic-events/service/event.service';
import { ReportService } from '../../service/report.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-add-custom-report',
  templateUrl: './add-custom-report.component.html',
  styleUrls: ['./add-custom-report.component.scss']
})
export class AddCustomReportComponent implements OnInit {

  @ViewChild('buttontoggel', { static: true }) buttontoggel: ElementRef<HTMLElement>;

  @Input() item: any;
  @Output() hideClose = new EventEmitter();
  ReportTable = new ReportTable()
  dataarray: any = [];
  reportArray: any = [];
  public EventsTypes: any = [];
  public tabulatorColumn1: any;
  public Description: any;
  public Title: any;
  public busy: boolean;
  public isSelected: boolean = false
  selectLabel: any = [];
  SelectColumn: any = [];
  public myInventoryField: Observable<any>;
  public tabulatorColumn3: any[] = [{ "field": "Ascending" }, { "field": "Descending" }];
  public tabulatorColumn2: any[] = [{ "id": 1, "field": "One" }, { "id": 2, "field": "Two" }, { "id": 3, "field": "Three" }, { "id": 4, "field": "Four" }];
  public tabledata: any = [];
  public availuser: boolean = false;
  public ColumnDataType: string;
  public tabulatorColumn: any = [];
  public selectedTenantId: number;
  public adddata: boolean = false;
  public columnFilters: any[] = [];
  public selectItemColumn
  public CustomFields;
  public EventList: any;
  constructor(private commanService: CommanSharedService, private router: Router, private eventService: EventService, private reportService: ReportService, private customfieldservice: CustomFieldService, private authService: AuthService,) { }
  public tablecolumname: any = [];
  public customreport = {
    reportTitle: "",
    subTitle: "",
    description: "",
    reportType: "Event Report",
    ColumnFilter: [],
  }
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



  public columnFilter: any = {
    // columnDataType: "string",
    // columnName: "",
    // conlumnLabel: "",
    // columnOperator: "",
    // columnValue: "",
    // type: "",
    // sortOrder: ""
  }

  public IsFilterActive: boolean = true;


  public dataColumnFilter: DataColumnFilter = {
    columnName: "",
    displayName: "",
    filterOperator: 'string',
    searchValue: "",
    type: ""
  }
  ngOnInit(): void {

    debugger;
    this.dataarray.push(this.ReportTable)
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    // this.tabulatorColumn1 = JSON.parse(localStorage.getItem("tabelColumn"));

    this.GetAllFields();
    this.GetEvents();
    this.columnFilter = {
      // columnName: "",
      // conlumnLabel: "",
      // columnOperator: "cn",
      // columnValue: "",
      // datatype: "",
      // width: "",
      // type: "",
      // sortOrder: 0
    }
    this.columnFilters.push(this.columnFilter);
    this.ApplyJsFunction();

  }
  Close() {
    this.hideClose.emit(false);
  }

  changeItemDropdown(obj, opt) {
    debugger;
    let data = this.selectItemColumn;

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
  onOptionsSelected1(obj, event) {
    debugger;
    this.tabulatorColumn3.forEach(element => {

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

  GetAllFields() {
    debugger;
    this.customfieldservice.GetAllFields(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {

      })).subscribe(result => {
        this.CustomFields = [];
        if (result.code == 200) {
          debugger;
          // this.CustomFields = result.entity;

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

              this.tabulatorColumn.push({ title: element.columnLabel, field: element.columnName, type: element.customFieldType, datatype: "string", width: "170" });

            });
          }

        }
      })
  }




  selectColumn(item, label, filter) {
    debugger;
    var index = this.SelectColumn.indexOf(item, label, filter);
    if (index === -1) {


      this.SelectColumn.push({ "ColumnName": item, "ConlumnLable": label, "columnOperator": filter });

    } else {

      this.SelectColumn.splice(index, 1);

    }
  }
  ApplyJsFunction() {
    setTimeout(function () {
      toggle();
      inputClear();
      inputFocus();
      // datePicker();
    }, 500)
  }

  addRow() {
    debugger;
    this.columnFilter = {
      // columnName: "string",
      // conlumnLabel: "",
      // columnOperator: "cn",
      // columnValue: "",
      // SortOrder: "",
      // SortType: ""
    }
    this.columnFilters.push(this.columnFilter);
    this.ApplyJsFunction();
  }
  GetCustomFields() {
    debugger;
    this.customfieldservice.GetCustomFields(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
      })).subscribe(result => {
        this.CustomFields = [];
        if (result.code == 200) {
          this.CustomFields = result.entity;
          this.ApplyJsFunction();
        }
      })
  }


  removeForm(index) {
    debugger;
    this.columnFilters.splice(index, 1);
  }



  save() {
    this.customreport.ColumnFilter = this.columnFilters;
    debugger;
    this.reportService.AddCustomReport(this.selectedTenantId, this.authService.accessToken, this.customreport).subscribe((result => {

      if (result.code == 200) {
        this.router.navigate(['/report/event-report']);
      }
    }))
  }


}
