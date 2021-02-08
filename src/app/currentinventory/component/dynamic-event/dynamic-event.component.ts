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
    this.currentData = {
      components: JSON.parse(this.DynamicEvent.eventFormJsonString).components
    };
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


  onSubmit(event) {
    debugger;
    if (this.selectedDynamicEvent.eventQuantityAction == "Add") {
      let add = event.data["add"];
      let add1 = event.data["add1"];
      let add2 = event.data["add2"];
      if (add != undefined)
        this.InventoryTransactionObj.transactionQtyChange = add;
      if (add1 != undefined)
        this.InventoryTransactionObj.transactionQtyChange = add1;
      if (add2 != undefined)
        this.InventoryTransactionObj.transactionQtyChange = add2;
    }
    if (this.selectedDynamicEvent.eventQuantityAction == "Remove") {
      let remove = event.data["remove"];
      let remove1 = event.data["remove1"];
      let remove2 = event.data["remove1"];

      if (remove != undefined)
        this.InventoryTransactionObj.transactionQtyChange = remove;
      if (remove1 != undefined)
        this.InventoryTransactionObj.transactionQtyChange = remove1;
      if (remove2 != undefined)
        this.InventoryTransactionObj.transactionQtyChange = remove2;
    }

    if (this.selectedDynamicEvent.eventQuantityAction == "Move") {
      let moveqty = event.data["fieldsetMoveQuantity"]
      let move1qty = event.data["fieldsetMoveQuantity1"]
      let move2qty = event.data["fieldsetMoveQuantity2"]
      if (moveqty != undefined)
        this.InventoryTransactionObj.transactionQtyChange = moveqty;
      if (move1qty != undefined)
        this.InventoryTransactionObj.transactionQtyChange = move1qty;
      if (move2qty != undefined)
        this.InventoryTransactionObj.transactionQtyChange = move2qty;


      let ToThisLocation = event.data["fieldsetToThisLocation"]
      let ToThisLocation1 = event.data["fieldsetToThisLocation1"]
      let ToThisLocation2 = event.data["fieldsetToThisLocation2"]

      if (ToThisLocation != undefined) {

        if (ToThisLocation == this.InventoryTransactionObj.locationId) {
          this.toastr.warning("please select different Location");
          event.data['submit'] = false;
          return false;
        }
        else {
          this.TransactionTargetObj.ToLocationId = ToThisLocation;
        }
      }
      if (ToThisLocation1 != undefined) {
        if (ToThisLocation1 == this.InventoryTransactionObj.locationId) {
          this.toastr.warning("please select different Location");
          event.data['submit'] = false;
          return false;
        }
        else {
          this.TransactionTargetObj.ToLocationId = ToThisLocation1;
        }
      }
      if (ToThisLocation2 != undefined) {
        if (ToThisLocation2 == this.InventoryTransactionObj.locationId) {
          this.toastr.warning("please select different Location");
          event.data['submit'] = false;
          return false;
        }
        else {
          this.TransactionTargetObj.ToLocationId = ToThisLocation2;
        }
      }


    }
    if (this.selectedDynamicEvent.eventQuantityAction == "Convert") {
      let Convertqty = event.data["fieldsetConvertQuantity"]
      let Convert1qty = event.data["fieldsetConvertQuantity1"]
      let Convert2qty = event.data["fieldsetConvertQuantity2"]
      if (Convertqty != undefined)
        this.InventoryTransactionObj.transactionQtyChange = Convertqty;
      if (Convert1qty != undefined)
        this.InventoryTransactionObj.transactionQtyChange = Convert1qty;
      if (Convert2qty != undefined)
        this.InventoryTransactionObj.transactionQtyChange = Convert2qty;


      let ToThisUOM = event.data["fieldsetwithUom"]
      let ToThisUOM1 = event.data["fieldsetwithUom1"]
      let ToThisUOM2 = event.data["fieldsetwithUom2"]

      if (ToThisUOM != undefined) {

        if (ToThisUOM == this.InventoryTransactionObj.uomId) {
          this.toastr.warning("please select different UOM");
          event.data['submit'] = false;
          return false;
        }
        else {
          this.TransactionTargetObj.ToUomId = ToThisUOM;
        }
      }
      if (ToThisUOM1 != undefined) {
        if (ToThisUOM1 == this.InventoryTransactionObj.uomId) {
          this.toastr.warning("please select different UOM");
          event.data['submit'] = false;
          return false;
        }
        else {
          this.TransactionTargetObj.ToUomId = ToThisUOM1;
        }
      }
      if (ToThisUOM2 != undefined) {
        if (ToThisUOM2 == this.InventoryTransactionObj.uomId) {
          this.toastr.warning("please select different UOM");
          event.data['submit'] = false;

          return false;
        }
        else {
          this.TransactionTargetObj.ToUomId = ToThisUOM2;
        }
      }

      let intothisQuantity = event.data["intothisQuantity"]
      let intothisQuantity1 = event.data["intothisQuantity1"]
      let intothisQuantity2 = event.data["intothisQuantity2"]
      if (intothisQuantity != undefined)
        this.TransactionTargetObj.ToConvertedQuantity = intothisQuantity;
      if (intothisQuantity1 != undefined)
        this.TransactionTargetObj.ToConvertedQuantity = intothisQuantity1;
      if (intothisQuantity2 != undefined)
        this.TransactionTargetObj.ToConvertedQuantity = intothisQuantity2;

    }

    this.CustomFields.forEach(element => {

      if (element.customFieldIncludeOnDynamicEvent) {
        element.columnValue = (event.data[element.columnName]).toString();
      }
    });
    this.InventoryTransactionObj.customFields = this.CustomFields;
    this.InventoryTransactionObj.tenantId = this.selectedTenantId;
    debugger
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
            this.RefreshInventory.emit();
          }
        });

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



  // AddEventSubmit() {
  //   debugger;
  //   this.spinner.show();
  //   this.InventoryTransactionObj.transactionQtyChange = this.InventoryTransactionObj.transactionQty;
  //   this.InventoryTransactionObj.circumstanceFields = this.CircumstanceFields;
  //   this.InventoryTransactionObj.customFields = this.CustomFields;
  //   this.InventoryTransactionObj.tenantId = this.selectedTenantId;
  //   if (this.TransactionTargetObj.ToUomId == null) {
  //     this.TransactionTargetObj.ToUomId = 0;
  //   }
  //   else {
  //     this.TransactionTargetObj.ToUomId = JSON.parse(this.TransactionTargetObj.ToUomId.toString())
  //   }
  //   let data = {
  //     InventoryId: this.InventoryTransactionObj.inventoryId,
  //     Transaction: this.InventoryTransactionObj,
  //     Targets: this.TransactionTargetObj,
  //     eventConfiguartion: this.selectedDynamicEvent,
  //   }
  //   this.currentinventoryService.DynamicEventTransaction(this.selectedTenantId, this.authService.accessToken, data).pipe(finalize(() => {
  //     this.spinner.hide();
  //   }))
  //     .subscribe(
  //       result => {
  //         if (result.entity == true) {
  //           this.RefreshInventory.emit();
  //         }
  //       });
  // }
  AddCustomModal() {
    debugger;
    this.AddCustomForm = true;
  }

}
