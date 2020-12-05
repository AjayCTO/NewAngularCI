import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InventoryTransactionViewModel, TransactionTarget } from '../../models/admin.models';
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
@Component({
  selector: 'app-move-event',
  templateUrl: './move-event.component.html',
  styleUrls: ['./move-event.component.scss']
})
export class MoveEventComponent implements OnInit {
  @Input() IsMoveEvent: boolean;
  @Input() item: any;
  @Input() CircumstanceFields: any;
  @Input() InventoryTransactionObj: any
  @Input() StateFields: any;
  @Output() newItemEvent = new EventEmitter<any>();
  @Output() RefreshInventory = new EventEmitter();
  public today: Date;
  public selectedTenantId: number;
  public Locationkeyword = 'locationName';
  public isLoadingResult: boolean = false;
  public data: any;
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
    item.EventAction = 3;
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
    }, 300)
  }

  MoveEventSubmit() {


    if (this.TransactionTargetObj.ToLocation == "") {
      this.toastr.warning("Location field is required");
      return false;
    }
    if (this.InventoryTransactionObj.quantity < this.InventoryTransactionObj.transactionQty) {

      this.toastr.warning("Change Quantity Greater Then Actual Quantity");
      return false;

    }
    if (this.InventoryTransactionObj.locationName.toLowerCase() == this.TransactionTargetObj.ToLocation.toLowerCase()) {

      this.toastr.warning("Please move these states to a different location.");
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
