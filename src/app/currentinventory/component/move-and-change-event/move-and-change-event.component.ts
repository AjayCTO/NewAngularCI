import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TransactionTarget, ChangeStateFields } from '../../models/admin.models';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CurrentinventoryService } from '../../service/currentinventory.service';
import { CommanSharedService } from '../../../shared/service/comman-shared.service';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import datePicker from '../../../../assets/js/lib/_datePicker';
import trigger from '../../../../assets/js/lib/_trigger';
import dropdown from '../../../../assets/js/lib/_dropdown';
@Component({
  selector: 'app-move-and-change-event',
  templateUrl: './move-and-change-event.component.html',
  styleUrls: ['./move-and-change-event.component.scss']
})
export class MoveAndChangeEventComponent implements OnInit {
  @Input() IsMoveAndChangeEvent: boolean;
  @Input() item: any;
  @Input() CircumstanceFields: any;
  @Input() InventoryTransactionObj: any
  @Input() StateFields: any;
  @Input() statusList: any;
  @Output() newItemEvent = new EventEmitter<any>();
  @Output() RefreshInventory = new EventEmitter();
  public today: Date;
  public selectedTenantId: number;
  public Locationkeyword = 'locationName';
  public isLoadingResult: boolean = false;
  public data: any;
  public ChangeStateFields: ChangeStateFields[] = [];

  public ChangeStateField: ChangeStateFields = {
    columnName: "",
    columnValue: "",
  };
  constructor(private authService: AuthService, private toastr: ToastrService, private commanService: CommanSharedService, private currentinventoryService: CurrentinventoryService, private spinner: NgxSpinnerService) {
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

  EventAction(item: any) {
    item.EventAction = 7;
    this.newItemEvent.emit(item);
  }

  ComboValueDropdown(Value) {
    let items = [];
    if (Value != null) {
      items = Value.split('\n');
    }
    return items;
  }


  getLocation(event) {
    this.isLoadingResult = true;
    this.TransactionTargetObj.ToLocation = event;
    this.commanService.GetLocationWithTerm(event, this.selectedTenantId, this.authService.accessToken,)
      .subscribe(response => {
        this.data = response.entity;
        this.isLoadingResult = false;
      });
  }

  selectLocationEvent(item) {
    this.TransactionTargetObj.ToLocationId = item.locationId;
    this.TransactionTargetObj.ToLocation = item.locationName;
  }

  searchCleared() {
    console.log('searchCleared');
    this.data = [];
  }
  ApplyJsFunction() {
    setTimeout(function () {
      inputClear();
      inputFocus();
      datePicker();
      dropdown();
    }, 500)
  }
  MoveandChangeEventSubmit() {

    if (this.TransactionTargetObj.ToLocation == "") {
      this.toastr.warning("Location field is required");
      return false;
    }
    if (this.InventoryTransactionObj.quantity < this.InventoryTransactionObj.transactionQty) {

      this.toastr.warning("Change Quantity Greater Then Actual Quantity");
      return false;

    }
    if (this.InventoryTransactionObj.locationName.toLowerCase() == this.TransactionTargetObj.ToLocation.toLowerCase() && this.InventoryTransactionObj.statusValue.toLowerCase() == this.TransactionTargetObj.ToStatus.toLowerCase()) {

      this.toastr.error("You are trying to move & change these state without changing their location, changes, or Status, which is not allowed. Please change at least one value (location or change or status) to a different value.");
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
      this.toastr.error("Please change these state with a different value.", "NO CHANGE HAVE CHANGED")

      return false;
    }
    else {
      this.InventoryTransactionObj.stateFields = this.StateFields
    }
    if (this.InventoryTransactionObj.statusValue.toLowerCase() == this.TransactionTargetObj.ToStatus.toLowerCase()) {
      this.toastr.error("Please update these states with a different Status.", "Status HAS NOT CHANGED")
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
