import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TransactionTarget, ChangeStateFields } from '../../models/admin.models';
import { finalize } from 'rxjs/operators';
import { LibraryService } from '../../../library/service/library.service';
import { AuthService } from '../../../core/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CurrentinventoryService } from '../../service/currentinventory.service'
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import datePicker from '../../../../assets/js/lib/_datePicker';
import trigger from '../../../../assets/js/lib/_trigger';
@Component({
  selector: 'app-remove-event',
  templateUrl: './remove-event.component.html',
  styleUrls: ['./remove-event.component.scss']
})
export class RemoveEventComponent implements OnInit {
  @Input() IsRemoveEvent: boolean;
  @Input() item: any;
  @Input() InventoryTransactionObj: any
  @Input() CircumstanceFields: any;
  @Input() StateFields: any;
  @Output() newItemEvent = new EventEmitter<any>();
  @Output() RefreshInventory = new EventEmitter();
  public today: Date;
  constructor(private authService: AuthService, private toastr: ToastrService, private currentinventoryService: CurrentinventoryService, private libraryService: LibraryService, private spinner: NgxSpinnerService) { }
  public ChangeStateFields: ChangeStateFields[] = [];


  selectedTenantId: number;
  public ChangeStateField: ChangeStateFields = {
    columnName: "",
    columnValue: "",
  };


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
    this.today = new Date();
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    let data = this.CircumstanceFields;


    this.ApplyJsFunction();
  }
  ApplyJsFunction() {
    setTimeout(function () {
      inputClear();
      inputFocus();
      datePicker();
    }, 300)
  }
  EventAction(item: any) {
    item.EventAction = 2;
    this.newItemEvent.emit(item);
  }

  ComboValueDropdown(Value) {
    let items = [];
    if (Value != null) {
      items = Value.split('\n');
    }
    return items;
  }

  RemoveEventSubmit() {

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
