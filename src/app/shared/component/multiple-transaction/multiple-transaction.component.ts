import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter, ViewChild, ElementRef, } from '@angular/core';
import { getSeletectEvent, selectSelectedTenant, getSelectedCart } from 'src/app/store/selectors/tenant.selectors';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../shared/appState';
import { finalize } from 'rxjs/operators';
import { CommanSharedService } from '../../service/comman-shared.service';
import { AuthService } from 'src/app/core/auth.service';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import modal from '../../../../assets/js/lib/_modal';
import { LibraryService } from '../../../library/service/library.service';
import { ToastrService } from 'ngx-toastr';
import { CurrentinventoryService } from '../../../currentinventory/service/currentinventory.service'

import { CurrentInventory, InventoryTransactionViewModel, TransactionTargets, ChangeStateFields, Tenant, DataColumnFilter } from '../../../currentinventory/models/admin.models'
import { Router } from '@angular/router';
import { SetSelectedTenant, SetSelectedTenantId, SetDefaultInventoryColumn, SetSelectedEvent, SetSelectedCart } from '../../../store/actions/tenant.action';
import { CustomFieldService } from 'src/app/customfield/service/custom-field.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-multiple-transaction',
  templateUrl: './multiple-transaction.component.html',
  styleUrls: ['./multiple-transaction.component.scss']
})
export class MultipleTransactionComponent implements OnInit {
  @ViewChild('closeInventoryModal', { static: true }) closeInventoryModal: ElementRef<HTMLElement>;
  @Output() ClearConfirms = new EventEmitter();
  public EventConfiguration: any
  public cartDetails: any;
  public selectedTenantId;
  public busy: boolean;
  public loadingRecords: boolean = false;
  public selectedId: number;
  public SelectedView: any;
  public locationsList: any[];
  public uomList: any[];
  public ClearConfirm: boolean;
  public length: number = 0
  public groupInventoryDetails: any[];
  public selectedUOm;
  public selectedLocation;
  public today: Date;
  public CancleConfirm: boolean;
  public CustomFields: any;
  CurrentInventoryObj: CurrentInventory = {
    partId: 0,
    partName: "",
    partDescription: "",
    quantity: 1,
    costPerUnit: 0,
    uomId: 0,
    uomName: "",
    inventoryId: 0,
    locationId: 0,
    locationName: "",
    transactionDate: new Date(),
    statusValue: "",
    attributeFields: [],
    circumstanceFields: [],
    stateFields: [],
    customFields: [],
    eventConfiguartion: null,
  }
  InventoryTransactionObjList = [];
  InventoryTransactionObj: any = {
    partId: 0,
    tenantId: 0,
    uomId: 0,
    locationId: 0,
    costPerUnit: 0,
    partName: "",
    partDescription: "",
    quantity: 1,
    uomName: "",
    locationName: "",
    transactionQty: 0,
    transactionCostPerUnit: 0,
    transactionQtyChange: 0,
    avgCostPerUnit: 0,
    transactionActionId: 0,
    inventoryId: 0,
    statusValue: "",
    attributeFields: [],
    circumstanceFields: [],
    stateFields: [],
    customFields: [],
  }
  TransactionTargetObjList = [];
  TransactionTargetObj: TransactionTargets = {
    ToLocationId: 0,
    ToConvertedQuantity: 0,
    ToLocation: "",
    Cost: 0,
    ToStatus: "",
    ToStatusId: 0,
    ToUom: "",
    ToUomId: null,
  }

  constructor(protected store: Store<AppState>, private spinner: NgxSpinnerService, private customfieldservice: CustomFieldService, private commanService: CommanSharedService, private libraryService: LibraryService, private cdr: ChangeDetectorRef, private toastr: ToastrService, private authService: AuthService, private router: Router, private currentinventoryService: CurrentinventoryService,) {
    this.today = new Date();
  }

  ngOnInit(): void {
    debugger;
    this.ClearConfirm = false;
    this.CancleConfirm = false;
    this.store.pipe(select(selectSelectedTenant)).
      subscribe(event => {
        if (event) {
          this.selectedTenantId = event.tenantId;
          this.GetCustomFields();
        }
        this.cdr.detectChanges();
      });
    this.store.pipe(select(getSeletectEvent)).
      subscribe(Eventconfiguration => {
        this.EventConfiguration = Eventconfiguration;
      });
    this.store.pipe(select(getSelectedCart)).
      subscribe(getSelectedCart => {
        this.cartDetails = getSelectedCart;
        this.GetCartInventory();
      });
    this.getLocationList();
    this.getUOMList();
    this.ApplyJsFunction()

  }
  ApplyJsFunction() {
    setTimeout(function () {
      modal();
      inputClear();
      inputFocus();
    }, 500)
  }

  public GetCartInventory() {
    this.loadingRecords = true;
    debugger;
    this.commanService.getcartinventoryDetails(this.selectedTenantId, this.authService.accessToken, this.cartDetails).subscribe(res => {
      if (res) {
        debugger;
        this.groupInventoryDetails = [];
        this.groupInventoryDetails = res.entity.items;
        this.loadingRecords = false;
        this.length = res.entity.totalItems;

        this.groupInventoryDetails.forEach(element => {
          element.customFieldsList = this.CustomFields;
        });
      }
    })
  }
  DeleteItem(id) {
    debugger;
    this.groupInventoryDetails.forEach((element, index) => {
      if (element.inventoryId == id) {
        this.groupInventoryDetails.splice(index, 1)
        this.toastr.success("your item is removed from list")
      }

    });


  }
  clearConfirm(item) {
    debugger;
    this.selectedId = item.id;
    this.ClearConfirm = true;
  }
  deleteValue(value: boolean) {
    const html = document.querySelector('html');
    html.classList.remove('js-modal-page');
    this.ClearConfirm = false;
  }
  cancelValue(value: boolean) {
    const html = document.querySelector('html');
    html.classList.remove('js-modal-page');
    this.CancleConfirm = false;
  }
  clearCart() {
    debugger;
    this.groupInventoryDetails = []
    this.toastr.success("Cart Item Has Been Removed Successfully")
    this.router.navigateByUrl('/CurrentInventory')
  }
  getLocationList() {
    this.libraryService.GetLocation(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
        // this.spinner.hide();
      })).subscribe(result => {
        this.locationsList = result.entity;
      })
  }
  getUOMList() {
    this.libraryService.GetUOM(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
        // this.spinner.hide();
      })).subscribe(result => {
        this.uomList = result.entity;
      })
  }
  // Save() {
  //   debugger;
  //   this.groupInventoryDetails






  //   this.currentinventoryService.DynamicMultipleInventoryTransaction(this.selectedTenantId, this.authService.accessToken, this.groupInventoryDetails).subscribe(res => {
  //     if (res.code = 200) {
  //       this.toastr.success("your cart is save")

  //       // this.groupInventoryDetails = res.entity.items;
  //       // this.loadingRecords = false;
  //       // this.length = res.entity.totalItems;
  //       // debugger;
  //     }
  //   })
  // }
  cancleConfirm() {
    this.CancleConfirm = true;
  }
  Save() {
    debugger
    // if (this.EventConfiguration.eventQuantityAction == "Move") {

    //   if (this.TransactionTargetObj.ToLocation == "") {
    //     this.toastr.warning("Location field is required");
    //     return false;
    //   }
    //   if (this.InventoryTransactionObj.quantity < this.InventoryTransactionObj.transactionQty) {

    //     this.toastr.warning("Change Quantity Greater Then Actual Quantity");
    //     return false;

    //   }
    //   if (this.InventoryTransactionObj.locationName.toLowerCase() == this.TransactionTargetObj.ToLocation.toLowerCase()) {

    //     this.toastr.warning("Please move these states to a different location.");
    //     return false;
    //   }

    // }
    // if (this.EventConfiguration.eventQuantityAction == "Convert") {
    //   if (this.InventoryTransactionObj.quantity < this.InventoryTransactionObj.transactionQty) {

    //     this.toastr.warning("Change Quantity Greater Then Actual Quantity");
    //     return false;
    //   }
    //   if (this.InventoryTransactionObj.uomId == this.TransactionTargetObj.ToUomId) {
    //     this.toastr.error("Please convert the states to a different unit of measure.", "UNITS OF MEASURE HAVE NOT CHANGED")
    //     return false;
    //   }

    // }
    this.spinner.show();

    debugger;
    this.groupInventoryDetails.forEach(element => {


      this.InventoryTransactionObj = {
        partId: element.partId,
        tenantId: this.selectedTenantId,
        uomId: element.uomId,
        locationId: element.locationId,
        costPerUnit: element.costPerUnit,
        partName: element.partName,
        partDescription: element.partDescription,
        quantity: element.quantity,
        uomName: element.uomName,
        locationName: element.locationName,
        // transactionQty: element.transactionQty,
        transactionCostPerUnit: element.transactionCostPerUnit,
        // transactionQtyChange: this.InventoryTransactionObj.transactionQty,
        avgCostPerUnit: element.avgCostPerUnit,
        transactionActionId: this.EventConfiguration.id,
        inventoryId: element.inventoryId,
        statusValue: "",
        attributeFields: element.attributeFields,
        circumstanceFields: [],
        stateFields: [],
        customFields: element.customFieldsList,
        transactionDate: this.today,
        ToLocationId: 0,
        ToConvertedQuantity: 0,
        ToLocation: "",
        Cost: 0,
        ToStatus: "",
        ToStatusId: 0,
        ToUom: "",
        ToUomId: null,
      }
      this.InventoryTransactionObjList.push(this.InventoryTransactionObj);
    });

    // this.InventoryTransactionObj.transactionQtyChange = this.InventoryTransactionObj.transactionQty;
    // this.InventoryTransactionObj.customFields = this.CustomFields;
    // this.InventoryTransactionObj.tenantId = this.selectedTenantId;
    // if (this.TransactionTargetObj.ToUomId == null) {
    //   this.TransactionTargetObj.ToUomId = 0;
    // }
    // else {
    //   this.TransactionTargetObj.ToUomId = JSON.parse(this.TransactionTargetObj.ToUomId.toString())
    // }
    let data = {
      TransactionList: this.InventoryTransactionObjList,
      EventConfiguration: this.EventConfiguration,
    }
    this.currentinventoryService.DynamicMultipleInventoryTransaction(this.selectedTenantId, this.authService.accessToken, data).subscribe(res => {
      if (res.code = 200) {
        this.toastr.success("your Transaction is done");
        let el: HTMLElement = this.closeInventoryModal.nativeElement;
        el.click();
        this.router.navigateByUrl('/CurrentInventory')

        // this.groupInventoryDetails = res.entity.items;
        // this.loadingRecords = false;
        // this.length = res.entity.totalItems;
        // debugger;
      }
    })
    //  if()
  }

  GetCustomFields() {
    debugger;
    this.customfieldservice.GetCustomFields(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
        this.spinner.hide();
      })).subscribe(result => {
        this.CustomFields = [];
        if (result.code == 200) {
          let obj = JSON.parse(this.EventConfiguration.circumstanceJsonString);
          this.CustomFields = result.entity;
          this.CustomFields.forEach(element => {
            if (element.comboBoxValue != "") {
              element.comboBoxArray = JSON.parse(element.comboBoxValue);
            }
            element.customFieldIncludeOnDynamicEvent = obj[element.columnName];
          });
          this.ApplyJsFunction();
        }
      })
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

}
