import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators'
import { AuthService } from '../../../core/auth.service';
import { LibraryService } from '../../service/library.service';
import { CommanSharedService } from '../../../shared/service/comman-shared.service';
import { from, Observable } from 'rxjs';
import { AppState } from '../../../shared/appState';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomFieldService } from 'src/app/customfield/service/custom-field.service';



//JS Stylte Function
import modal from '../../../../assets/js/lib/_modal';
import toggle from '../../../../assets/js/lib/_toggle';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import datePicker from '../../../../assets/js/lib/_datePicker';


import * as XLSX from 'xlsx';
@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit {
  public selectedTenantId: number;
  public error: string;
  public units: any = [];
  public busy: boolean;
  public myInventoryField: Observable<any>;
  public tabulatorColumn: any = [];
  public item: any;
  loadingRecords = false;
  constructor(protected store: Store<AppState>, private router: Router, private toastr: ToastrService, private cdr: ChangeDetectorRef, private libraryService: LibraryService, private authService: AuthService,
    private spinner: NgxSpinnerService, private commanService: CommanSharedService,
    private customfieldservice: CustomFieldService) { }

  ngOnInit(): void {
    this.GetMyInventoryColumn();
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
  GetMyInventoryColumn() {

    this.commanService.GetMyInventoryColumns(this.selectedTenantId, this.authService.accessToken).pipe(finalize(() => {
      this.busy = false;
      this.spinner.hide();
    })).subscribe(result => {

      if (result.entity != null) {
        this.myInventoryField = result.entity;
        this.myInventoryField.forEach(element => {
          if (element.customeFieldType == "AttributeField" || element.customeFieldType == "") {
            this.tabulatorColumn.push({ title: element.columnLabel, field: element.columnName, type: element.customeFieldType, datatype: element.dataType, customFieldSpecialType: element.customFieldSpecialType, width: element.columnWidth });
          }
        });
        this.item = result.entity;
        this.GetUnits();
        this.ApplyJsFunction();


      }

    })
  }

  GetUnits() {
    this.loadingRecords = true;
    let sortCol = "PartName";
    let sortDir = "asc";

    // this.libraryService.getUnitList(this.selectedTenantId, this.authService.accessToken, this.pageIndex + 1, this.pageSize, sortCol, sortDir, this.searchFilterText, this.FilterArray)
    //   .pipe(finalize(() => {


    //   })).subscribe(result => {
    //     debugger

    //     if (result.code == 403) {
    //       this.router.navigateByUrl('/notPermited');
    //     }
    // this.loadingRecords = false;
    // this.PartDataBind = [];
    // this.allItems = [];

    // this.allItems = result.entity.parts;
    // this.length = result.entity.totalParts;

    // for (let i = 0; i < this.allItems.length; i++) {
    //   let map = new Map<string, any>();
    //   for (let j = 0; j < this.tabulatorColumn.length; j++) {

    //     let keys = Object.keys(this.allItems[i])
    //     for (let key = 0; key < keys.length; key++) {

    //       if (keys[key] == this.tabulatorColumn[j].field) {

    //         map.set(this.tabulatorColumn[j].field, this.allItems[i][keys[key]])
    //       }
    //       else {
    //         map.set(keys[key], this.allItems[i][keys[key]])
    //       }
    //     }

    //     for (let k = 0; k < this.allItems[i].attributeFields.length; k++) {

    //       if (this.allItems[i].attributeFields[k].columnName == this.tabulatorColumn[j].field) {

    //         if (this.tabulatorColumn[j].datatype == "Date/Time") {
    //           if (this.allItems[i].attributeFields[k].columnValue != "") {
    //             this.myDT = new Date(this.allItems[i].attributeFields[k].columnValue)
    //             let DateManual = this.myDT.toLocaleDateString();
    //             if (this.tabulatorColumn[j].customFieldSpecialType == "Time") {
    //               DateManual = this.myDT.toLocaleTimeString()
    //             }
    //             if (this.tabulatorColumn[j].customFieldSpecialType == "Date & Time") {
    //               DateManual = this.myDT.toLocaleString();
    //             }
    //             if (this.tabulatorColumn[j].customFieldSpecialType == "Date") {
    //               DateManual = this.myDT.toLocaleDateString()
    //             }
    //             map.set(this.tabulatorColumn[j].field, DateManual)
    //           }
    //           else {
    //             map.set(this.tabulatorColumn[j].field, this.allItems[i].attributeFields[k].columnValue)
    //           }
    //         }
    //         else {
    //           map.set(this.tabulatorColumn[j].field, this.allItems[i].attributeFields[k].columnValue)
    //         }
    //       }
    //     }
    //   }

    //   let jsonObject = {};
    //   map.forEach((value, key) => {
    //     jsonObject[key] = value
    //   });

    //   this.PartDataBind.push(jsonObject);
    // }
    // modal();


    // });
  }
}
