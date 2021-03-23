import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
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

import { CurrentInventory, InventoryTransactionViewModel, TransactionTarget, ChangeStateFields, Tenant, DataColumnFilter } from '../../../currentinventory/models/admin.models'
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
  public groupInventoryDetails: any;
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
  TransactionTargetObj: TransactionTarget = {
    ToLocationId: 0,
    ToConvertedQuantity: 0,
    ToLocation: "",
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

        this.groupInventoryDetails = res.entity.items;
        this.loadingRecords = false;
        this.length = res.entity.totalItems;
        debugger;
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
  Save() {
    this.commanService.savecartinventoryDetails(this.selectedTenantId, this.authService.accessToken, this.cartDetails).subscribe(res => {
      if (res.code = 200) {
        this.toastr.success("your cart is save")

        // this.groupInventoryDetails = res.entity.items;
        // this.loadingRecords = false;
        // this.length = res.entity.totalItems;
        // debugger;
      }
    })
  }
  cancleConfirm() {
    this.CancleConfirm = true;
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

          this.CustomFields = result.entity;
          this.CustomFields.forEach(element => {
            if (element.comboBoxValue != "") {
              element.comboBoxArray = JSON.parse(element.comboBoxValue);
            }
          });
          this.ApplyJsFunction();
        }
      })
  }

}
