import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AttributeFields, CustomFields } from '../customfield/models/customfieldmodel'
import { CustomFieldService } from '../customfield/service/custom-field.service'
import { AuthService } from '../core/auth.service';
import { finalize } from 'rxjs/operators';
import { Router, Routes } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { select, Store } from '@ngrx/store';
import { AppState } from '../shared/appState'
import { selectSelectedTenantId, selectSelectedTenant, selectMyInventoryColumn, getTenantConfiguration } from '../store/selectors/tenant.selectors';


@Component({
  selector: 'app-quick-field-creator',
  templateUrl: './quick-field-creator.component.html',
  styleUrls: ['./quick-field-creator.component.scss']
})
export class QuickFieldCreatorComponent implements OnInit {
  public selectedTenantId: number;
  busy: boolean;
  error: string;

  public AllFieldList: any = []
  public FieldCreation: any = []

  length: number = 0;

  public AttributeField = [{ 'columnLabel': 'Color', 'customFieldType': 'AttributeField', 'dataType': 'Text', 'isSelected': false, 'isAdded': false },
  { 'columnLabel': 'Size', 'customFieldType': 'AttributeField', 'dataType': 'Text', 'isSelected': false, 'isAdded': false },
  { 'columnLabel': 'Brand', 'customFieldType': 'AttributeField', 'dataType': 'Text', 'isSelected': false, 'isAdded': false },
  { 'columnLabel': 'Category', 'customFieldType': 'AttributeField', 'dataType': 'Text', 'isSelected': false, 'isAdded': false },
  { 'columnLabel': 'List Price', 'customFieldType': 'AttributeField', 'dataType': 'Number', 'isSelected': false, 'isAdded': false },
  { 'columnLabel': 'Manufacturer', 'customFieldType': 'AttributeField', 'dataType': 'Text', 'isSelected': false, 'isAdded': false },
  { 'columnLabel': 'Material', 'customFieldType': 'AttributeField', 'dataType': 'Text', 'isSelected': false, 'isAdded': false },
  { 'columnLabel': 'Model Number', 'customFieldType': 'AttributeField', 'dataType': 'Text', 'isSelected': false, 'isAdded': false },
  { 'columnLabel': 'Part Number', 'customFieldType': 'AttributeField', 'dataType': 'Text', 'isSelected': false, 'isAdded': false },
  { 'columnLabel': 'SKU', 'customFieldType': 'AttributeField', 'dataType': 'Text', 'isSelected': false, 'isAdded': false },
  { 'columnLabel': 'Type', 'customFieldType': 'AttributeField', 'dataType': 'Text', 'isSelected': false, 'isAdded': false },
  { 'columnLabel': 'UPC', 'customFieldType': 'AttributeField', 'dataType': 'Text', 'isSelected': false, 'isAdded': false },
  { 'columnLabel': 'Vendors', 'customFieldType': 'AttributeField', 'dataType': 'Text', 'isSelected': false, 'isAdded': false },
  { 'columnLabel': 'Weight', 'customFieldType': 'AttributeField', 'dataType': 'Number', 'isSelected': false, 'isAdded': false },
  ]

  public CustomField = [{ 'columnLabel': 'Purchase Order Number', 'customFieldType': 'CustomField', 'dataType': 'Number', 'isSelected': false, 'isAdded': false },
  { 'columnLabel': 'Purchase Date', 'customFieldType': 'CustomField', 'dataType': 'Date/Time', 'isSelected': false, 'isAdded': false },
  { 'columnLabel': 'Sale Order Number', 'customFieldType': 'CustomField', 'dataType': 'Number', 'isSelected': false, 'isAdded': false },
  { 'columnLabel': 'Sale Date', 'customFieldType': 'CustomField', 'dataType': 'Date/Time', 'isSelected': false, 'isAdded': false },
  { 'columnLabel': 'Sale Notes', 'customFieldType': 'CustomField', 'dataType': 'Text', 'isSelected': false, 'isAdded': false },
  { 'columnLabel': 'Job Number', 'customFieldType': 'CustomField', 'dataType': 'Text', 'isSelected': false, 'isAdded': false },
  { 'columnLabel': 'Vendor', 'customFieldType': 'CustomField', 'dataType': 'Text', 'isSelected': false, 'isAdded': false },
  { 'columnLabel': 'Carrier', 'customFieldType': 'CustomField', 'dataType': 'Text', 'isSelected': false, 'isAdded': false },
  { 'columnLabel': 'Customer', 'customFieldType': 'CustomField', 'dataType': 'Text', 'isSelected': false, 'isAdded': false },
  { 'columnLabel': 'Invoice Number', 'customFieldType': 'CustomField', 'dataType': 'Text', 'isSelected': false, 'isAdded': false },
  { 'columnLabel': 'Order Number', 'customFieldType': 'CustomField', 'dataType': 'Text', 'isSelected': false, 'isAdded': false },
  { 'columnLabel': 'Sale Price', 'customFieldType': 'CustomField', 'dataType': 'Number', 'isSelected': false, 'isAdded': false },
  { 'columnLabel': 'Serial Number', 'customFieldType': 'CustomField', 'dataType': 'Text', 'isSelected': false, 'isAdded': false },
  { 'columnLabel': 'Tracking Number', 'customFieldType': 'CustomField', 'dataType': 'Text', 'isSelected': false, 'isAdded': false },
  ]




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

  constructor(private toastr: ToastrService, private router: Router, private authService: AuthService, private customfieldservice: CustomFieldService, protected store: Store<AppState>, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.store.pipe(select(selectSelectedTenant)).
      subscribe(event => {
        if (event) {

          // this.selectedTenant = event;
          this.selectedTenantId = event.tenantId;
        }
        this.cdr.detectChanges();
      });
    // this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    this.GetAllFields();

  }

  createField(data) {

    if (data.isSelected == false) {
      data.isSelected = true;
      if (data.customFieldType == 'AttributeField') {
        this.attributeFields = {
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
        this.AttributeField.forEach(element => {
          if (data.columnLabel == element.columnLabel) {
            this.attributeFields.columnLabel = element.columnLabel
            this.attributeFields.columnName = element.columnLabel
            this.attributeFields.dataType = element.dataType
            this.attributeFields.customFieldType = element.customFieldType
            // this.attributeFields.customFieldSpecialType = element.customFieldSpecialType
            this.FieldCreation.push(this.attributeFields)
          }
        });
      }
      else {
        this.customField = {
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

        this.CustomField.forEach(element => {
          if (data.columnLabel == element.columnLabel) {
            this.customField.columnLabel = element.columnLabel
            this.customField.columnName = element.columnLabel
            this.customField.dataType = element.dataType
            this.customField.customFieldType = element.customFieldType
            // this.customField.customFieldSpecialType = element.customFieldSpecialType
            this.FieldCreation.push(this.customField)
          }
        });
      }
    }
    else {
      this.FieldCreation.splice(data.columnLabel, 1);
    }
  }

  GetAllFields() {

    this.customfieldservice.GetAllFields(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;

      })).subscribe(result => {
        if (result.code == 403) {
          this.router.navigateByUrl('/notPermited');

        }
        else {
          if (result.entity != null) {


            this.AllFieldList = result.entity;
            this.AllFieldList.forEach(elements => {
              this.AttributeField.forEach(element => {
                if (element.columnLabel == elements.columnLabel) {
                  element.isAdded = true
                }

              });
            });
            this.AllFieldList.forEach(elements => {
              this.CustomField.forEach(element => {
                if (element.columnLabel == elements.columnLabel) {
                  element.isAdded = true
                }
              });
            });
          }
        }
      })
  }


  CreateFields() {



    this.customfieldservice.InsertQuickColumn(this.FieldCreation, this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
      }))
      .subscribe(
        result => {
          if (result) {
            if (result.code == 200) {


              this.toastr.success("Your Item  Is Successfully Add.");
              this.router.navigateByUrl("/CurrentInventory")

            }
            else {
              this.toastr.warning(result.message);
            }
          }
        },
        error => {
          this.error = error;
          ;
        });
  }











}
