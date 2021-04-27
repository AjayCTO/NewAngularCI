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
import { InventoryCoreService } from '../../../shared/service/inventory-core.service';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../shared/appState';
import { selectSelectedTenantId, selectSelectedTenant, selectMyInventoryColumn, getTenantConfiguration } from '../../../store/selectors/tenant.selectors';

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
  @Input() AttributeFields: any;
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
  public array: any;
  AddCustomForm = false;
  constructor(private authService: AuthService, private cdr: ChangeDetectorRef, private commanService: CommanSharedService, private toastr: ToastrService, private currentinventoryService: CurrentinventoryService, private spinner: NgxSpinnerService, private inventorcoreSevice: InventoryCoreService, protected store: Store<AppState>) {
    this.today = new Date();

  }
  public FilterArray: any[] = [];
  public dataColumnFilter: any = {
    field: "",
    operator: "$eq",
    value: ""
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


    let data = this.CustomFields;
    if (this.DynamicEvent.eventFormJsonString != null) {
      this.currentData = {
        components: JSON.parse(this.DynamicEvent.eventFormJsonString).components
      };
    }
    // this.currentData = this.DynamicEvent.eventFormJsonString;
    this.isDataLoaded = true;
    this.store.pipe(select(selectSelectedTenant)).
      subscribe(event => {
        if (event) {

          // this.selectedTenant = event;
          this.selectedTenantId = event.tenantId;
        }
        this.cdr.detectChanges();
      });
    // this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    this.getUnitID()
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



  // AddEventSubmit() {

  //   if (this.selectedDynamicEvent.eventQuantityAction == "Move") {

  //     if (this.TransactionTargetObj.ToLocation == "") {
  //       this.toastr.warning("Location Field Is Required");
  //       return false;
  //     }
  //     if (this.InventoryTransactionObj.quantity < this.InventoryTransactionObj.transactionQty) {

  //       this.toastr.warning("Change Quantity Greater Then Actual Quantity");
  //       return false;

  //     }
  //     if (this.InventoryTransactionObj.locationName.toLowerCase() == this.TransactionTargetObj.ToLocation.toLowerCase()) {

  //       this.toastr.warning("Please Move These States To A Different Location.");
  //       return false;
  //     }

  //   }
  //   if (this.selectedDynamicEvent.eventQuantityAction == "Convert") {
  //     if (this.InventoryTransactionObj.quantity < this.InventoryTransactionObj.transactionQty) {

  //       this.toastr.warning("Change Quantity Greater Then Actual Quantity");
  //       return false;
  //     }
  //     if (this.InventoryTransactionObj.uomId == this.TransactionTargetObj.ToUomId) {
  //       this.toastr.error("Please Convert The States To A Different Unit Of Measure.", "UNITS OF MEASURE HAVE NOT CHANGED")
  //       return false;
  //     }

  //   }
  //   this.spinner.show();
  //   this.InventoryTransactionObj.transactionQtyChange = this.InventoryTransactionObj.transactionQty;
  //   this.InventoryTransactionObj.circumstanceFields = this.CircumstanceFields;
  //   this.InventoryTransactionObj.customFields = this.CustomFields;
  //   this.InventoryTransactionObj.tenantId = this.selectedTenantId;
  //   this.InventoryTransactionObj.transactionDate = this.today;
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
  //           this.toastr.success("Transaction Is Done");
  //           this.RefreshInventory.emit();
  //         }
  //       });
  // }
  AddCustomModal() {

    this.AddCustomForm = true;
  }


  //Invenotry Core


  // create-unit - and - increment

  buildObject = (arr) => {
    const obj = {};
    for (let i = 0; i < arr.length; i++) {
      const { columnName, columnValue } = arr[i];
      obj[columnName] = columnValue;
    };
    return obj;
  };
  AddEventSubmit() {
    if (this.selectedDynamicEvent.eventQuantityAction == "Add") {
      debugger;
      if (this.InventoryTransactionObj.transactionQty == "") {
        this.toastr.warning("Quantity  Field Is Required");
        return false;
      }
      this.array

      this.InventoryTransactionObj.transactionQtyChange = this.InventoryTransactionObj.transactionQty;
      this.InventoryTransactionObj.circumstanceFields = this.CircumstanceFields;
      let details = this.buildObject(this.CustomFields);
      // this.InventoryTransactionObj.customFields = this.CustomFields;
      this.InventoryTransactionObj.tenantId = this.selectedTenantId;
      this.InventoryTransactionObj.transactionDate = this.today;
      // if (this.TransactionTargetObj.ToUomId == null) {
      //   this.TransactionTargetObj.ToUomId = 0;
      // }
      // else {
      //   this.TransactionTargetObj.ToUomId = JSON.parse(this.TransactionTargetObj.ToUomId.toString())
      // }
      let data = {
        quantity: this.InventoryTransactionObj.transactionQtyChange,
        date: this.InventoryTransactionObj.transactionDate,
        reference: '',
        kind: this.selectedDynamicEvent.eventName,
        details: details,
        unitId: this.InventoryTransactionObj.inventoryId
      }
      this.inventorcoreSevice.Increment(this.selectedTenantId, this.authService.accessToken, data).subscribe(
        result => {
          this.spinner.hide();
          debugger;
          if (result) {
            this.toastr.success("Transaction Is Done");
            this.RefreshInventory.emit();
          }
        }

      )
    }
    if (this.selectedDynamicEvent.eventQuantityAction == "Remove") {
      debugger;
      if (this.InventoryTransactionObj.transactionQty == "") {
        this.toastr.warning("Quantity  Field Is Required");
        return false;
      }


      this.InventoryTransactionObj.transactionQtyChange = this.InventoryTransactionObj.transactionQty;
      this.InventoryTransactionObj.circumstanceFields = this.CircumstanceFields;
      let details = this.buildObject(this.CustomFields);
      // this.InventoryTransactionObj.customFields = this.CustomFields;
      this.InventoryTransactionObj.tenantId = this.selectedTenantId;
      this.InventoryTransactionObj.transactionDate = this.today;
      // if (this.TransactionTargetObj.ToUomId == null) {
      //   this.TransactionTargetObj.ToUomId = 0;
      // }
      // else {
      //   this.TransactionTargetObj.ToUomId = JSON.parse(this.TransactionTargetObj.ToUomId.toString())
      // }
      let data = {
        quantity: this.InventoryTransactionObj.transactionQtyChange,
        date: this.InventoryTransactionObj.transactionDate,
        reference: '',
        kind: this.selectedDynamicEvent.eventName,
        details: details,
        unitId: this.InventoryTransactionObj.inventoryId
      }
      this.inventorcoreSevice.Decrement(this.selectedTenantId, this.authService.accessToken, data).subscribe(
        result => {
          this.spinner.hide();
          debugger;
          if (result) {
            this.toastr.success("Transaction Is Done");
            this.RefreshInventory.emit();
          }
        }

      )
    }

    if (this.selectedDynamicEvent.eventQuantityAction == "Move" || this.selectedDynamicEvent.eventQuantityAction == "Convert") {

      debugger;
      // this.FilterArray.push(this.dataColumnFilter = {
      //   field: "itemCode",
      //   operator: "$eq",
      //   value: this.InventoryTransactionObj.itemCode
      // })

      // this.AttributeFields.forEach(element => {
      //   this.FilterArray.push(
      //     this.dataColumnFilter = {
      //       field: "states." + element.columnName,
      //       operator: "$eq"
      //       value: element.columnValue,     
      //     }
      //   )
      // });

      let details = this.buildObject(this.CustomFields);
      let states = this.buildObject(this.AttributeFields);
      // this.InventoryTransactionObj.customFields = this.CustomFields;
      this.InventoryTransactionObj.tenantId = this.selectedTenantId;
      this.InventoryTransactionObj.transactionDate = this.today;

      let data = {
        quantity: this.InventoryTransactionObj.transactionQty,
        date: this.InventoryTransactionObj.transactionDate,
        reference: '',
        kind: this.selectedDynamicEvent.eventName,
        details: details,
        fromUnitId: this.InventoryTransactionObj.unitId,
        toStates: states
      }
      this.inventorcoreSevice.CreateUnitandAssign(this.selectedTenantId, this.authService.accessToken, data).subscribe(
        result => {
          this.spinner.hide();
          debugger;

        }
      )
    }





  }


  getUnitID() {
    debugger
    this.inventorcoreSevice.GetUnitID(3053, this.authService.accessToken).subscribe(
      result => {
        debugger
        // this.spinner.hide();
        this.array = result;

      })

  }



}
