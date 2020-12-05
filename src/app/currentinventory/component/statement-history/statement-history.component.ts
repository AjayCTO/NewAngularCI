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
  selectedTenantId: number;
  error: string;
  public today: Date;
  public statementHistory: any;
  public transaction_History: any;
  constructor(private currentinventoryService: CurrentinventoryService, private authService: AuthService, private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
    debugger;
    let id = this.StatementHistory;
    let CustomFields = this.CustomFields;
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    this.StatementServices();
    this.ApplyJsFunction();
  }
  StatementServices() {
    debugger;
    this.currentinventoryService.GetStatementHistory(this.selectedTenantId, this.authService.accessToken, this.InventoryTransactionObj.inventoryId)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {
          debugger;
          this.statementHistory = result.entity.transaction_History;

          this.statementHistory.forEach(MainArray => {
            MainArray.customFields.forEach(element => {

              this.CustomFields.forEach(elementcustom => {
                if (elementcustom.columnName == element.columnName) {
                  element.columnLabel = elementcustom.columnLabel;
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
  ApplyJsFunction() {
    setTimeout(function () {
      inputClear();
      inputFocus();
      datePicker();
    }, 2000)
  }
}
