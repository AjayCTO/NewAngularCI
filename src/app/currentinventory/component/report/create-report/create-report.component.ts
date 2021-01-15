import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { CommanSharedService } from '../../../../shared/service/comman-shared.service';
import { from, Observable } from 'rxjs';
import { CurrentinventoryService } from '../../../service/currentinventory.service'
import toggle from '../../../../../assets/js/lib/_toggle';
import inputFocus from '../../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../../assets/js/lib/_inputClear';
import { AuthService } from '../../../../core/auth.service';
import { finalize } from 'rxjs/operators';
import { ReportTable, DataColumnFilter } from '../../../models/admin.models';
import { SetSelectedTenant, SetSelectedTenantId } from '../../../../store/actions/tenant.action';
import { CustomFieldService } from '../../../../customfield/service/custom-field.service';
@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.scss']
})
export class CreateReportComponent implements OnInit {
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
  public tabledata: any = [];
  public availuser: boolean = false;
  public ColumnDataType: string;
  public tabulatorColumn: any;
  public selectedTenantId: number;
  public adddata: boolean = false;

  public CustomFields: any[] = [];
  constructor(private commanService: CommanSharedService, private customfieldservice: CustomFieldService, private authService: AuthService,) { }

  public tablecolumname: any = [];
  public columnFilter: any = {
    ColumnName: 'string',
    ConlumnLable: 'string',
    ColumOperator: 'string',
    ColumnValue: 'string',
    SortOrder: 'number'
  }

  public IsFilterActive: boolean = true;
  public customreport = {
    reportTitle: '',
    SubTitle: '',
    Description: 'string',
    isSelected: true,
    ColumnFilter: this.SelectColumn

  }

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

    this.GetCustomFields();
    this.ApplyJsFunction();
  }
  Close() {
    this.hideClose.emit(false);
  }
  // selectField(item) {
  //   // debugger;
  //   this.isSelected = true
  //   var index = this.selectLabel.indexOf(item);
  //   if (index === -1) {


  //     this.selectLabel.push({ item });
  //     this.columnFilter = {
  //       ColumnName: this.SelectColumn,
  //       ConlumnLable: this.selectLabel,
  //       ColumOperator: 'string',
  //       ColumnValue: 'string',
  //       SortOrder: 'number'
  //     }

  //   } else {

  //     this.selectLabel.splice(index, 1);

  //   }

  // }
  selectColumn(item, label, filter) {
    debugger;
    var index = this.SelectColumn.indexOf(item, label, filter);
    if (index === -1) {


      this.SelectColumn.push({ "ColumnName": item, "ConlumnLable": label, "ColumOperator": filter });

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

  selectEvent(item) {
    var index = this.EventsTypes.indexOf(item);
    if (index === -1) {


      this.EventsTypes.push({ item });


    } else {

      this.EventsTypes.splice(index, 1);

    }
  }


  user1() {
    this.availuser = false;
  }
  user() {
    this.availuser = true;
  }

  save() {
    debugger;
    this.customreport

    // if (form__checkbox == checked) {

    // }



  }

}
