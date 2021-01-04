import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommanSharedService } from '../../../../shared/service/comman-shared.service';
import { from, Observable } from 'rxjs';
import { CurrentinventoryService } from '../../../service/currentinventory.service'
import toggle from '../../../../../assets/js/lib/_toggle';
import inputFocus from '../../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../../assets/js/lib/_inputClear';
import { AuthService } from '../../../../core/auth.service';
import { finalize } from 'rxjs/operators';
import { ReportTable } from '../../../models/admin.models';
import { SetSelectedTenant, SetSelectedTenantId } from '../../../../store/actions/tenant.action';
@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.css']
})
export class CreateReportComponent implements OnInit {
  @Input() item: any;
  @Output() hideClose = new EventEmitter();
  ReportTable = new ReportTable()
  dataarray = [];
  public OpenAdvanced = false;
  public Showform: boolean = false;
  public tabulatorColumn1: any;
  public busy: boolean;
  public myInventoryField: Observable<any>;
  public tabledata: any = [];
  public availuser: boolean = false;
  public tabulatorColumn: any;
  public selectedTenantId: number;
  public adddata: boolean = false;
  constructor(private commanService: CommanSharedService, private authService: AuthService,) { }
  public array: any = [];
  public tablecolumname: any = [];

  ngOnInit(): void {
    debugger;
    this.dataarray.push(this.ReportTable)
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    this.tabulatorColumn1 = JSON.parse(localStorage.getItem("tabelColumn"));

    // this.tabulatorColumn1 = this.item;

    this.ApplyJsFunction();
  }
  Close() {
    this.hideClose.emit(false);
  }

  ApplyJsFunction() {
    setTimeout(function () {
      toggle();
      inputClear();
      inputFocus();
      // datePicker();
    }, 200)
  }
  addNewColumn() {
    this.Showform = true;
    this.ApplyJsFunction();
    // $('#f').show();
  }
  close() {
    debugger;
    this.Showform = false;
  }
  add() {
    debugger;
    this.ReportTable = new ReportTable();
    this.dataarray.push(this.ReportTable);
    this.ApplyJsFunction();
  }
  removeForm(index) {
    debugger;
    this.dataarray.splice(index, 1);
  }
  hide() {
    $('#f').hide();
  }
  hide1() {
    $('#g').hide();
  }
  user1() {
    this.availuser = false;
  }
  user() {
    this.availuser = true;
  }

}
