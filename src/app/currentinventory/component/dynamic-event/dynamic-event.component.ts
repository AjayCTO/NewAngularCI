import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
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
import modal from '../../../../assets/js/lib/_modal';
import { JsonHubProtocol } from '@aspnet/signalr';
@Component({
  selector: 'app-dynamic-event',
  templateUrl: './dynamic-event.component.html',
  styleUrls: ['./dynamic-event.component.scss']
})
export class DynamicEventComponent implements OnInit {

  @Input() selectedDynamicEvent: any;
  @Input() IsDynamicEventOpen: boolean;
  @Input() item: any;
  @Input() DynamicEvent: any;
  @Input() CircumstanceFields: any;
  @Input() CustomFields: any;
  @Input() InventoryTransactionObj: any
  @Input() StateFields: any;
  @Output() newItemEvent = new EventEmitter<any>();
  @Output() RefreshInventory = new EventEmitter();
  @Input() statusList: any;
  @Input() UomList: any[];
  public today: Date;
  public selectedTenantId: number;
  public Locationkeyword = 'locationName';
  public isLoadingResult: boolean = false;
  public data: any;
  AddCustomForm = false;
  constructor(private authService: AuthService, private cdr: ChangeDetectorRef, private commanService: CommanSharedService, private toastr: ToastrService, private currentinventoryService: CurrentinventoryService, private spinner: NgxSpinnerService) {
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
  isDataLoaded = false;
  currentData: any;
  ngOnInit(): void {

    debugger;
    let data = this.CustomFields;
    if (this.DynamicEvent.eventFormJsonString != null) {
      this.currentData = {
        components: JSON.parse(this.DynamicEvent.eventFormJsonString).components
      };
    }
    // this.currentData = this.DynamicEvent.eventFormJsonString;
    this.isDataLoaded = true;
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));

    this.ApplyJsFunction();

    modal();

  }

  EventAction(item: any) {
    item.EventAction = 1;
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



  AddEventSubmit() {

    if (this.selectedDynamicEvent.eventQuantityAction == "Move") {

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

    }
    if (this.selectedDynamicEvent.eventQuantityAction == "Convert") {
      if (this.InventoryTransactionObj.quantity < this.InventoryTransactionObj.transactionQty) {

        this.toastr.warning("Change Quantity Greater Then Actual Quantity");
        return false;
      }
      if (this.InventoryTransactionObj.uomId == this.TransactionTargetObj.ToUomId) {
        this.toastr.error("Please convert the states to a different unit of measure.", "UNITS OF MEASURE HAVE NOT CHANGED")
        return false;
      }

    }
    this.spinner.show();
    this.InventoryTransactionObj.transactionQtyChange = this.InventoryTransactionObj.transactionQty;
    this.InventoryTransactionObj.circumstanceFields = this.CircumstanceFields;
    this.InventoryTransactionObj.customFields = this.CustomFields;
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
      Targets: this.TransactionTargetObj,
      eventConfiguartion: this.selectedDynamicEvent,
    }
    this.currentinventoryService.DynamicEventTransaction(this.selectedTenantId, this.authService.accessToken, data).pipe(finalize(() => {
      this.spinner.hide();
    }))
      .subscribe(
        result => {
          if (result.entity == true) {
            this.toastr.success("Transaction is done");
            this.RefreshInventory.emit();
          }
        });
  }
  AddCustomModal() {
    debugger;
    this.AddCustomForm = true;
  }

}
