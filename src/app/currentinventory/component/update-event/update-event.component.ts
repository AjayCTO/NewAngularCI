import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InventoryTransactionViewModel, TransactionTarget } from '../../models/admin.models';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import datePicker from '../../../../assets/js/lib/_datePicker';
import { CurrentinventoryService } from '../../service/currentinventory.service';
import { AuthService } from '../../../core/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import dropdown from '../../../../assets/js/lib/_dropdown';
@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.component.html',
  styleUrls: ['./update-event.component.scss']
})
export class UpdateEventComponent implements OnInit {

  @Input() IsUpdateEvent: boolean;
  @Input() item: any;
  @Input() CircumstanceFields: any;
  @Input() InventoryTransactionObj: any
  @Input() statusList: any;
  @Output() newItemEvent = new EventEmitter<any>();
  @Output() RefreshInventory = new EventEmitter();

  public today: Date;
  public selectedTenantId: number;
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
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    this.ApplyJsFunction();
  }
  ApplyJsFunction() {
    setTimeout(function () {
      inputClear();
      inputFocus();
      datePicker();
    }, 100);
  }




  EventAction(item: any) {
    item.EventAction = 5;
    this.newItemEvent.emit(item);
  }

  ComboValueDropdown(Value) {
    let items = [];
    if (Value != null) {
      items = Value.split('\n');
    }
    return items;
  }


  UpdateEventSubmit() {


    if (this.InventoryTransactionObj.quantity < this.InventoryTransactionObj.transactionQty) {
      this.toastr.warning("Change Quantity Greater Then Actual Quantity");
      return false;
    }
    if (this.InventoryTransactionObj.statusValue.toLowerCase() == this.TransactionTargetObj.ToStatus.toLowerCase()) {
      this.toastr.error("Please update these states with a different Status.", "Status HAS NOT CHANGED")
      return false;

    }
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





