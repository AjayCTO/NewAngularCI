import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CustomFieldService } from '../../../customfield/service/custom-field.service';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/auth.service';
import { AttributeFields, CustomFields } from '../../../customfield/models/customfieldmodel'
import { CommanSharedService } from '../../service/comman-shared.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { select, Store } from '@ngrx/store';
import { selectSelectedTenantId, selectMyInventoryColumn, getTenantConfiguration } from 'src/app/store/selectors/tenant.selectors';
import { SetSelectedTenant, SetSelectedTenantId, SetTenantConfigurantion } from '../../../store/actions/tenant.action';
import { AppState } from 'src/app/store/models/app-state.model';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import { ToastrService } from 'ngx-toastr';
import { TenantConfig } from 'src/app/store/models/tenant.model';
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
  public tenantConfiguration: TenantConfig;
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
    costTracking: false,
    componentList: false,
    automatedItems: false,
    TimeZone: "",
    defaultQuantity: false,
    LowQuantityThreshold: false,
    QuantityRechesZero: false,
    negativeQuantity: false,
    theme: "",
    isLockItemLibrary: false,
    isLockLocationLibrary: false,
    isLockUOMLibrary: false,
    locationTermCustomized: "",
    uomTermCustomized: "",
    ItemTermCustomized: "",
    QuantityTermCustomized: ""
  }
  constructor(protected store: Store<AppState>, private customfieldservice: CustomFieldService, private cdr: ChangeDetectorRef, private authService: AuthService, private spinner: NgxSpinnerService,
    private commanService: CommanSharedService, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {

    this.Edit = false
    this.store.pipe(select(selectSelectedTenantId)).
      subscribe(TenantId => {
        if (TenantId) {

          this.selectedTenantId = TenantId;

        }
        this.cdr.detectChanges();
      });
    this.store.pipe(select(getTenantConfiguration)).subscribe(config => {
      if (config) {
        debugger
        this.tenantConfiguration = config;

      }
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
    this.GetTenantConfiguration()
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
    debugger;
    this.commanService.GetMyInventoryColumns(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
        this.spinner.hide();
      })).subscribe(result => {
        debugger
        if (result.entity != null) {

          this.MyInventoryFieldColumn = result.entity;
          this.MyInventoryFieldColumn.forEach(element => {
            element.isChanging = false;
          });
        }
      })
  }
  // Save inventory column 
  SaveMyInventoryColumn(currentColumn, event) {
    debugger;
    currentColumn.isChanging = true;
    this.MyInventoryFieldColumn.forEach(element => {
      if (element.columnLabel == currentColumn.columnLabel) {
        element.columnLabel = event
      }
    })

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
            this.saveConfigration()
          }
        })

  }

  // Save Configration Summary Settings Function
  saveConfigration() {
    debugger
    this.MyInventoryFieldColumn.forEach(element => {
      if (element.columnName == 'partName') {
        this.Features.ItemTermCustomized = element.columnLabel
      }
      if (element.columnName == 'uomName') {
        this.Features.uomTermCustomized = element.columnLabel
      }
      if (element.columnName == 'locationName') {
        this.Features.locationTermCustomized = element.columnLabel
      }
    })
    this.commanService.UpdateTenantConfiguration(this.selectedTenantId, this.authService.accessToken, this.tenantConfiguration.id, this.Features).pipe(finalize(() => {

    })).subscribe(
      result => {
        if (result.code == 200) {
          // this.toastr.success("Your Setting is Updated");
          this.store.dispatch(new SetTenantConfigurantion(result.entity));
        }
      }
    )
  }


  GetTenantConfiguration() {

    this.commanService.GetTenantConfiguration(this.selectedTenantId, this.authService.accessToken,).pipe(finalize(() => {

    })).subscribe(
      result => {
        if (result.code == 200) {
          this.Features = result.entity
        }
      }
    )

  }


}
