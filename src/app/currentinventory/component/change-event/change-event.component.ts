import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChangeStateFields, TransactionTarget } from '../../models/admin.models';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CurrentinventoryService } from '../../service/currentinventory.service';
import { CommanSharedService } from '../../../shared/service/comman-shared.service';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import datePicker from '../../../../assets/js/lib/_datePicker';
@Component({
  selector: 'app-change-event',
  templateUrl: './change-event.component.html',
  styleUrls: ['./change-event.component.scss']
})
export class ChangeEventComponent implements OnInit {
  @Input() IsChangeEvent: boolean;
  @Input() item: any;
  @Input() CircumstanceFields: any;
  @Input() InventoryTransactionObj: any
  @Input() StateFields: any;
  @Output() newItemEvent = new EventEmitter<any>();
  @Output() RefreshInventory = new EventEmitter();
  public today: Date;
  public selectedTenantId: number;
  public ChangeStateFields: ChangeStateFields[] = [];
  public ChangeStateField: ChangeStateFields = {
    columnName: "",
    columnValue: "",
  };

  constructor(private authService: AuthService, private toastr: ToastrService, private currentinventoryService: CurrentinventoryService, private spinner: NgxSpinnerService) {
    this.today = new Date();

  }



  TransactionTargetObj: TransactionTarget = {
    ToLocationId: 0,
    ToConvertedQuantity: 0,
    ToLocation: "",
    ToStatus: "",
    ToStatusId: 0,
    ToUom: "",
    ToUomId: null,
  }
  ngOnInit(): void {
    inputFocus();
    inputClear();
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));

    this.ApplyJsFunction();
  }

  EventAction(item: any) {
    item.EventAction = 6;
    this.newItemEvent.emit(item);
  }

  ComboValueDropdown(Value) {
    let items = [];
    if (Value != null) {
      items = Value.split('\n');
    }
    return items;
  }
  ApplyJsFunction() {
    setTimeout(function () {
      inputFocus();
      inputClear();

      datePicker();
    }, 300)
  }
  ChangeEventSubmit() {

    if (this.InventoryTransactionObj.quantity < this.InventoryTransactionObj.transactionQty) {
      this.toastr.warning("Change Quantity Greater Then Actual Quantity");
      return false;
    }
    this.ChangeStateFields = [];
    for (let i = 0; i < this.StateFields.length; i++) {
      this.ChangeStateField = {
        columnName: "",
        columnValue: "",
      }
      this.ChangeStateField.columnName = this.StateFields[i].columnName;
      this.ChangeStateField.columnValue = this.StateFields[i].columnValue;
      this.ChangeStateFields.push(this.ChangeStateField);
    }

    let obj1 = JSON.stringify(this.ChangeStateFields);
    let obj2 = JSON.stringify(this.InventoryTransactionObj.stateFields);

    if (obj1 == obj2) {
      this.toastr.warning("Please change these state with a different value.", "NO CHANGE HAVE CHANGED")

      return false;
    }
    else {
      this.InventoryTransactionObj.stateFields = this.StateFields
    }

    this.spinner.show();
    this.InventoryTransactionObj.transactionQtyChange = this.InventoryTransactionObj.transactionQty;
    this.InventoryTransactionObj.circumstanceFields = this.CircumstanceFields;
    this.InventoryTransactionObj.tenantId = this.selectedTenantId;
    if (this.TransactionTargetObj.ToUomId == null) {
      this.TransactionTargetObj.ToUomId = 0;
    }
    else {
      this.TransactionTargetObj.ToUomId = JSON.parse(this.TransactionTargetObj.ToUomId.toString())
    }
    let data = {
      InventoryId: this.InventoryTransactionObj.inventoryId,
      Transaction: this.InventoryTransactionObj,
      Targets: this.TransactionTargetObj
    }
    this.currentinventoryService.InventoryTransaction(this.selectedTenantId, this.authService.accessToken, data).pipe(finalize(() => {
      this.spinner.hide();
    }))
      .subscribe(
        result => {
          if (result.entity == true) {
            this.RefreshInventory.emit();
          }
        });
  }


}
