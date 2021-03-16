import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CustomFieldService } from '../../../customfield/service/custom-field.service';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/auth.service';
import { AttributeFields, CustomFields } from '../../../customfield/models/customfieldmodel'
import { CommanSharedService } from '../../service/comman-shared.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { select, Store } from '@ngrx/store';
import { selectSelectedTenantId, selectMyInventoryColumn } from 'src/app/store/selectors/tenant.selectors';
import { AppState } from 'src/app/store/models/app-state.model';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-configuration-summary',
  templateUrl: './configuration-summary.component.html',
  styleUrls: ['./configuration-summary.component.scss']
})
export class ConfigurationSummaryComponent implements OnInit {
  busy: boolean;
  public selectedTenantId: number;
  CustomFields: any;
  AttributeFields: any;
  length: number = 0;
  length1: number = 0;
  public NotPermitted: boolean = false;
  public Edit: boolean
  customField: CustomFields = {
    columnId: 0,
    columnName: '',
    columnLabel: '',
    customFieldType: '',
    dataType: '',
    columnValue: '',
    comboBoxValue: '',
    customFieldIsRequired: false,
    customFieldInformation: '',
    customFieldPrefix: '',
    customFieldSuffix: '',
    customFieldIsIncremental: false,
    customFieldBaseValue: 0,
    customFieldIncrementBy: 0,
    customFieldTextMaxLength: 0,
    customFieldDefaultValue: '',
    customFieldNumberMin: 0,
    customFieldNumberMax: 0,
    customFieldNumberDecimalPlaces: 0,
    customFieldTrueLabel: '',
    customFieldFalseLabel: '',
    customFieldSpecialType: '',
    dateDefaultPlusMinus: '',
    dateDefaultNumber: null,
    dateDefaulInterval: '',
    timeDefaultPlusMinus: '',
    timeNumberOfHours: null,
    timeNumberOFMinutes: null,
    offsetDateFields: '',
    offsetTimeFields: '',
  }
  attributeFields: AttributeFields = {
    columnId: 0,
    columnName: '',
    columnLabel: '',
    customFieldType: '',
    dataType: '',
    columnValue: '',
    comboBoxValue: '',
    customFieldIsRequired: false,
    customFieldInformation: '',
    customFieldPrefix: '',
    customFieldSuffix: '',
    customFieldIsIncremental: false,
    customFieldBaseValue: 0,
    customFieldIncrementBy: 0,
    customFieldTextMaxLength: 0,
    customFieldDefaultValue: '',
    customFieldNumberMin: 0,
    customFieldNumberMax: 0,
    customFieldNumberDecimalPlaces: 0,
    customFieldTrueLabel: '',
    customFieldFalseLabel: '',
    customFieldSpecialType: '',
    dateDefaultPlusMinus: '',
    dateDefaultNumber: null,
    dateDefaulInterval: '',
    timeDefaultPlusMinus: '',
    timeNumberOfHours: null,
    timeNumberOFMinutes: null,
    offsetDateFields: '',
    offsetTimeFields: '',
  }

  //My inventory column cusotmized
  error: string;
  MyInventoryFieldColumn: any[];
  myInventoryColumnSettings: any;

  public Features: any = {
    restocking: false,
    costTrcking: false,
    list: false,
    automatedItems: false
  }
  public ManageSetting: any = {
    TimeZone: "",
    defaultQuantity: false,
    LowQuantityThreshold: false,
    QuantityRechesZero: false,
    negativeQuantity: false
  }

  constructor(protected store: Store<AppState>, private customfieldservice: CustomFieldService, private cdr: ChangeDetectorRef, private authService: AuthService, private spinner: NgxSpinnerService,
    private commanService: CommanSharedService, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.Edit = false
    this.store.pipe(select(selectSelectedTenantId)).
      subscribe(TenantId => {
        if (TenantId) {
          debugger;
          this.selectedTenantId = TenantId;
        }
        this.cdr.detectChanges();
      });

    this.store.pipe(select(selectMyInventoryColumn)).
      subscribe(myInventoryColumn => {
        if (myInventoryColumn) {

          let column = myInventoryColumn;

        }
        this.cdr.detectChanges();
      });
    this.GetCustomFields();
    this.GetAttributeFields();
    this.GetMyInventoryColumns();
    setTimeout(() => {
      inputClear();
      inputFocus();
    }, 300);
  }

  // Get customField 
  GetCustomFields() {

    this.customfieldservice.GetCustomFields(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;

      })).subscribe(result => {
        if (result.code == 403) {
          this.NotPermitted = true;
        }
        else {
          if (result.entity != null) {
            debugger;

            this.CustomFields = result.entity;
            this.length = result.entity.length;
          }
        }
      })
  }
  showTimeZone() {
    this.Edit = true
  }
  // Get AttributeFields
  GetAttributeFields() {

    this.customfieldservice.GetAttributeFields(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;

      })).subscribe(result => {
        if (result.code == 403) {
          this.NotPermitted = true;
        }
        else {
          if (result.entity != null) {
            this.AttributeFields = result.entity;
            this.length1 = result.entity.length;
          }
        }
      })
  }

  // My inventory column Cusotmized Name
  GetMyInventoryColumns() {

    this.commanService.GetMyInventoryColumns(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
        this.spinner.hide();
      })).subscribe(result => {

        if (result.entity != null) {
          debugger;
          this.MyInventoryFieldColumn = result.entity;
          this.MyInventoryFieldColumn.forEach(element => {
            element.isChanging = false;
          });
        }
      })
  }
  // Save inventory column 
  SaveMyInventoryColumn(currentColumn) {
    debugger;
    currentColumn.isChanging = true;

    this.myInventoryColumnSettings = { MyInventoryColumnSettings: [] };
    this.myInventoryColumnSettings.MyInventoryColumnSettings = this.MyInventoryFieldColumn
    this.commanService.SaveMyInventoryColumns(this.myInventoryColumnSettings, this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {
          if (result) {

            currentColumn.isChanging = false;

          }
        })

  }

  // binding function of settings
  selcted(data) {
    debugger;
    if (data == 'cosTracking') {
      if (this.Features.costTrcking == false) {
        this.Features.costTrcking = true
      }
      else {
        this.Features.costTrcking = false
      }
    }
    if (data == 'restocking') {
      if (this.Features.restocking == false) {
        this.Features.restocking = true
      }
      else {
        this.Features.restocking = false
      }

    }
    if (data == 'list') {
      if (this.Features.list == false) {
        this.Features.list = true
      }
      else {
        this.Features.list = false
      }

    }
    if (data == 'automatedItems') {
      if (this.Features.automatedItems == false) {
        this.Features.automatedItems = true
      }
      else {
        this.Features.automatedItems = false
      }

    }
    if (data == 'defaultQuantity1') {
      if (this.ManageSetting.defaultQuantity == false) {
        this.ManageSetting.defaultQuantity = true
      }
      else {
        this.ManageSetting.defaultQuantity = false
      }

    }
    if (data == 'LowQuantityThreshold') {
      if (this.ManageSetting.LowQuantityThreshold == false) {
        this.ManageSetting.LowQuantityThreshold = true
      }
      else {
        this.ManageSetting.LowQuantityThreshold = false
      }

    }
    if (data == 'negativeQuantity') {
      if (this.ManageSetting.negativeQuantity == false) {
        this.ManageSetting.negativeQuantity = true
      }
      else {
        this.ManageSetting.negativeQuantity = false
      }

    }
    if (data == 'QuantityRechesZero') {
      if (this.ManageSetting.QuantityRechesZero == false) {
        this.ManageSetting.QuantityRechesZero = true
      }
      else {
        this.ManageSetting.QuantityRechesZero = false
      }

    }
  }

}
