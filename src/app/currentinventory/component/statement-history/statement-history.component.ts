import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LibraryService } from '../../../library/service/library.service';
import { AuthService } from '../../../core/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CurrentinventoryService } from '../../service/currentinventory.service'
import { finalize } from 'rxjs/operators';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import datePicker from '../../../../assets/js/lib/_datePicker';
import { InventoryCoreService } from '../../../shared/service/inventory-core.service';
@Component({
  selector: 'app-statement-history',
  templateUrl: './statement-history.component.html',
  styleUrls: ['./statement-history.component.scss']
})
export class StatementHistoryComponent implements OnInit {
  @Input() StatementHistory: boolean;
  @Input() item: any;
  @Input() CustomFields: any;
  @Input() InventoryTransactionObj: any;
  @Input() EventList: any;

  @Output() RefreshInventory = new EventEmitter();
  selectedTenantId: number;
  error: string;
  public today: Date;
  public myDT: Date;
  public statementHistory: any;
  public transaction_History: any;
  public SortingArray: any[] = [];
  lengths = 2;
  public Sorting: any = {
    field: "transactionId",
    direction: "DESC",
  }
  public FilterArray: any[] = [];
  public dataColumnFilter: any = {
    field: "",
    operator: "$eq",
    value: ""
  }
  loadingRecords = false;
  constructor(private currentinventoryService: CurrentinventoryService, private authService: AuthService, private spinner: NgxSpinnerService, private inventorcoreSevice: InventoryCoreService) { }

  ngOnInit(): void {
    debugger;
    let id = this.StatementHistory;
    let CustomFields = this.CustomFields;
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    this.FilterArray.push(this.dataColumnFilter = {
      field: 'unitId',
      operator: "$eq",
      value: this.InventoryTransactionObj.unitId
    });

    this.SortingArray.push(this.Sorting);
    //this.StatementServices();
    this.InventoryTransactionObj
    this.getHistoryStatements();
    this.ApplyJsFunction();
  }
  StatementServices() {

    this.loadingRecords = true;
    this.currentinventoryService.GetStatementHistory(this.selectedTenantId, this.authService.accessToken, this.InventoryTransactionObj.inventoryId)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {

          this.loadingRecords = false;
          this.statementHistory = result.entity.transaction_History;

          this.statementHistory.forEach(MainArray => {
            MainArray.customFields.forEach(element => {

              this.CustomFields.forEach(elementcustom => {
                if (elementcustom.columnName == element.columnName) {
                  element.columnLabel = elementcustom.columnLabel;
                  if (elementcustom.dataType == "Date/Time") {
                    this.myDT = new Date(element.columnValue)
                    let DateManual = this.myDT.toLocaleDateString();
                    if (elementcustom.customFieldSpecialType == "Time") {
                      DateManual = this.myDT.toLocaleTimeString()
                    }
                    if (elementcustom.customFieldSpecialType == "Date & Time") {
                      DateManual = this.myDT.toLocaleString();
                    }
                    if (elementcustom.customFieldSpecialType == "Date") {
                      DateManual = this.myDT.toLocaleDateString()
                    }
                    element.columnValue = DateManual;
                  }
                }
              });

            });
          });



        },
        error => {
          this.error = error;
          this.spinner.hide();
        })
  }

  public comfirmBoxDelete = false;
  public SelectedTransaction: any;
  UndoTransaction(transaction) {
    this.SelectedTransaction = transaction;
    this.comfirmBoxDelete = true;


  }

  Confirm() {
    this.spinner.show();
    this.currentinventoryService.UndoTransaction(this.selectedTenantId, this.authService.accessToken, this.SelectedTransaction.transactionId, this.SelectedTransaction.inventoryId, this.SelectedTransaction.parentTransactionId).subscribe(res => {
      if (res.code == 200) {
        this.spinner.hide()
        this.RefreshInventory.emit();
      }
    })
  }
  close() {
    this.comfirmBoxDelete = false;
  }
  ApplyJsFunction() {
    setTimeout(function () {
      inputClear();
      inputFocus();
      datePicker();
    }, 2000)
  }
  getHistoryStatements() {
    debugger;
    this.loadingRecords = true;
    let data = {
      "filters": this.FilterArray,
      "sortBy": this.SortingArray,
      "offset": 0,
      "limit": 50
    }
    this.inventorcoreSevice.QueryTransactionsHistoryAsync(this.selectedTenantId, this.authService.accessToken, data).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe(
      result => {
        debugger;
        this.loadingRecords = false;
        this.statementHistory = result;
        this.statementHistory.forEach(MainArray => {
          MainArray.detailitem = [];
          this.CustomFields.forEach(elementcustom => {
            if (elementcustom.dataType == "Date/Time") {
              this.myDT = new Date(MainArray.details[elementcustom.columnName])
              let DateManual = this.myDT.toLocaleDateString();
              if (elementcustom.customFieldSpecialType == "Time") {
                DateManual = this.myDT.toLocaleTimeString()
              }
              if (elementcustom.customFieldSpecialType == "Date & Time") {
                DateManual = this.myDT.toLocaleString();
              }
              if (elementcustom.customFieldSpecialType == "Date") {
                DateManual = this.myDT.toLocaleDateString()
              }
              MainArray.detailitem.push({ "columnLabel": elementcustom.columnLabel, "columnValue": DateManual })

            }
            else {
              MainArray.detailitem.push({ "columnLabel": elementcustom.columnLabel, "columnValue": MainArray.details[elementcustom.columnName] })
            }



          });

          this.EventList.forEach(element => {
            if (element.eventName.trim() == MainArray.kind.trim()) {
              MainArray.actionIcon = element.eventIcon
            }
          });
        });
      },
      error => {
        this.error = error;
        this.spinner.hide();
      })
  }
}
