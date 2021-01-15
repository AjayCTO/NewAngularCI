import { Component, OnInit } from '@angular/core';
import { CommanSharedService } from '../../../../../shared/service/comman-shared.service';
import { from, Observable } from 'rxjs';
import { CurrentinventoryService } from '../../../../service/currentinventory.service'
import toggle from '../../../../../../assets/js/lib/_toggle';
import inputFocus from '../../../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../../../assets/js/lib/_inputClear';
import { AuthService } from '../../../../../core/auth.service';
import { finalize } from 'rxjs/operators';
import { ReportTable } from '../../../../models/admin.models';
import { SetSelectedTenant, SetSelectedTenantId } from '../../../../../store/actions/tenant.action';
@Component({
  selector: 'app-create-newitem-report',
  templateUrl: './create-newitem-report.component.html',
  styleUrls: ['./create-newitem-report.component.css']
})
export class CreateNewitemReportComponent implements OnInit {
  public availuser: boolean = false;
  public OpenAdvanced = false;
  public Showform: boolean = false;
  public tabulatorColumn1: any;
  public busy: boolean;
  public myInventoryField: Observable<any>;
  public tabledata: any = [];
  
  public tabulatorColumn: any;
  public selectedTenantId: number;
  public adddata: boolean = false;
  ReportTable = new ReportTable()
  dataarray = [];
  public tablecolumname: any = [];
  constructor() { }

  ngOnInit(): void {
    this.dataarray.push(this.ReportTable)
    this.ApplyJsFunction();
  }
  ApplyJsFunction() {
    this.tabulatorColumn1 = JSON.parse(localStorage.getItem("tabelColumn"));
    setTimeout(function () {
      toggle();
      inputClear();
      inputFocus();
      // datePicker();
    }, 200)
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
