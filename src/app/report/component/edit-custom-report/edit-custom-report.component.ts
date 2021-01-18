import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import toggle from '../../../../assets/js/lib/_toggle';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import { AuthService } from '../../../core/auth.service';
import { AppState } from '../../../shared/appState';
import { select, Store } from '@ngrx/store';
import { selectSelectedTenantId, selectSelectedTenant } from '../../../store/selectors/tenant.selectors';
import { ReportService } from '../../service/report.service';

@Component({
  selector: 'app-edit-custom-report',
  templateUrl: './edit-custom-report.component.html',
  styleUrls: ['./edit-custom-report.component.scss']
})
export class EditCustomReportComponent implements OnInit {
  @Input() Data: any;
  @Input() tabledata:any;
  @Input() ReportData:any;
  public selectedTenantId: number;
  public EditMode :boolean 
  error: string;
  public columnFilters: any[] = [];
  public jsonobject:any;
  public deleteReport:boolean;
  public selectedId:number;
  public tabulatorColumn:any[]=[];
  public tabulatorColumn1:any[]=[{"field":"Ascending"},{"field":"Descending"}];
  public tabulatorColumn2:any[]=[{ "id":1,"field":"One"},{"id":2,"field":"Two"},{"id":3,"field":"Three"},{"id":4,"field":"Four"}];
  public ReportList = []
  public customreport = {
    reportTitle: "",
    subTitle: "",
    description: "",
    reportType: "Event Report",
    ColumnFilter: [],
  }
   public columnFilter: any = {  
  }
  constructor(protected store: Store<AppState>,private toast: ToastrService,private reportService: ReportService,private authService: AuthService) { }

  ngOnInit(): void {
    debugger;
    this.EditMode=true;
    this.deleteReport=false;
    this.customreport.reportTitle=this.Data.reportTitle;
    this.customreport.description=this.Data.description;
    this.customreport.subTitle=this.Data.subTitle;
    let Data= JSON.parse(this.Data.columnFilterJsonSettings);
    this.columnFilters =Data;
    this.tabulatorColumn=this.tabledata
    this.store.pipe(select(selectSelectedTenantId)).
    subscribe(eventId => {
      if (eventId) {
        debugger;
        this.selectedTenantId = eventId;
      }
      // this.cdr.detectChanges();
    });  
    // this.columnFilters.push(this.columnFilter);
    this.ApplyJsFunction();
  }
  ApplyJsFunction()
  {
  setTimeout(function () {
    toggle();
    inputClear();
    inputFocus();
  
  }, 200)
}
  addRow() {
    debugger;
   this.columnFilter={
    //  ColumnName: "string",
  //  columnLabel: "",
  //  columnOperator: "cn",
  //  columnValue: "",
  //  SortOrder: 0
  }
    this.columnFilters.push(this.columnFilter);
    this.ApplyJsFunction();
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
      value: "eq",
      src: "../../../../assets/img/filter/EqualTo.gif",

    },
    {
      name: "Not Equals",
      value: "ne",
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
  onOptionsSelected1(obj,event)
  {
    this.tabulatorColumn1.forEach(element => {
      if (element.field == event) {
        obj.SortType = element.datatype;
        // obj.ColumnLabel = element.title;
        // obj.columnName = element.field;
        // obj.type = element.type;
        // obj.datatype = element.datatype;
        // obj.width = element.width;
      }
    });
  }
  onOptionsSelected2(obj,event)
  {
    this.tabulatorColumn2.forEach(element => {
      if (element.field == event) {
        obj.SortOrder = element.datatype;
        // obj.ColumnLabel = element.title;
        // obj.columnName = element.field;
        // obj.type = element.type;
        // obj.datatype = element.datatype;
        // obj.width = element.width;
      }
    });
  }
  onOptionsSelected(obj, event) {
    debugger;
    this.tabulatorColumn.forEach(element => {
      if (element.field == event) {
        obj.ColumnDataType = element.datatype;
        obj.ColumnLabel = element.title;
        // obj.columnName = element.field;
        // obj.type = element.type;
        // obj.datatype = element.datatype;
        // obj.width = element.width;
      }
    });
    setTimeout(function () {
      inputClear();
      inputFocus();
    }, 500);
  }
  EditReport()
  {
    debugger;
   this.customreport.ColumnFilter=this.columnFilters; 
    debugger;
    this.reportService.UpdateCustomReport(this.selectedTenantId,this.authService.accessToken, this.Data.id,this.customreport)
    .subscribe((result => {
      if(result.code==200)
      {
      this.toast.success("Successfully update");
    }
    else if(result.code==400)
    {
      this.toast.success("Cant update");
    }
  }))
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
DeleteReport()
{
  debugger;
 
  this.reportService.DeleteCustomReport(this.selectedTenantId, this.Data.id,this.authService.accessToken)
  
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

          // this.GetUOM();
        }
      }

    },
    error => {
      this.error = error;
      // this.spinner.hide();
    });
}
CloseEdit()
{
  this.EditMode=false;
}
 }