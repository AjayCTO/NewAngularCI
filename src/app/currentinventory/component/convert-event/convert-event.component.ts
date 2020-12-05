import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InventoryTransactionViewModel, TransactionTarget } from '../../models/admin.models';
import { AuthService } from '../../../core/auth.service';
import { LibraryService } from '../../../library/service/library.service';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import datePicker from '../../../../assets/js/lib/_datePicker';
import { ToastrService } from 'ngx-toastr';
import { CurrentinventoryService } from '../../service/currentinventory.service';
import dropdown from '../../../../assets/js/lib/_dropdown';
@Component({
  selector: 'app-convert-event',
  templateUrl: './convert-event.component.html',
  styleUrls: ['./convert-event.component.scss']
})
export class ConvertEventComponent implements OnInit {

  @Input() IsConvertEvent: boolean;
  @Input() item: any;
  @Input() CircumstanceFields: any;
  @Input() InventoryTransactionObj: any
  @Output() newItemEvent = new EventEmitter<any>();
  @Output() RefreshInventory = new EventEmitter();
  @Input() today: Date;
  @Input() UomList: any[];
  busy: boolean;
  selectedTenantId: number;
  constructor(private authService: AuthService, private toastr: ToastrService, private currentinventoryService: CurrentinventoryService, private libraryService: LibraryService, private spinner: NgxSpinnerService) {
    this.today = new Date();
  }


  TransactionTargetObj: TransactionTarget = {
    ToLocationId: 0,
    ToConvertedQuantity: 1,
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
    }, 100)
  }
  EventAction(item: any) {
    item.EventAction = 4;
    this.newItemEvent.emit(item);
  }

  ComboValueDropdown(Value) {
    let items = [];
    if (Value != null) {
      items = Value.split('\n');
    }
    return items;
  }


  ConvertEventSubmit() {



    if (this.InventoryTransactionObj.quantity < this.InventoryTransactionObj.transactionQty) {

      this.toastr.warning("Change Quantity Greater Then Actual Quantity");
      return false;
    }
    if (this.InventoryTransactionObj.uomId == this.TransactionTargetObj.ToUomId) {
      this.toastr.error("Please convert the states to a different unit of measure.", "UNITS OF MEASURE HAVE NOT CHANGED")
      return false;
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
