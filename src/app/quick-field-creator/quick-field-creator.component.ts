import { Component, OnInit } from '@angular/core';
import { AttributeFields, CustomFields } from '../customfield/models/customfieldmodel'
import { CustomFieldService } from '../customfield/service/custom-field.service'
import { AuthService } from '../core/auth.service';
import { finalize } from 'rxjs/operators';
import { Router, Routes } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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

  public AttributeField = [{ 'columnLabel': 'Color', 'customFieldType': 'AttributeField', 'dataType': 'Text', 'customFieldSpecialType': 'Dropdown', 'isSelected': false },
  { 'columnLabel': 'Size', 'customFieldType': 'AttributeField', 'dataType': 'Text', 'customFieldSpecialType': 'Dropdown', 'isSelected': false },
  { 'columnLabel': 'Brand', 'customFieldType': 'AttributeField', 'dataType': 'Text', 'customFieldSpecialType': 'Dropdown', 'isSelected': false },
  { 'columnLabel': 'Category', 'customFieldType': 'AttributeField', 'dataType': 'Text', 'customFieldSpecialType': 'Dropdown', 'isSelected': false },
  // { 'columnId': 5, 'columnLabel': 'Dimensions', 'customFieldType': 'AttributeField', 'dataType': 'Text', 'customFieldSpecialType': '' },
  { 'columnLabel': 'List Price', 'customFieldType': 'AttributeField', 'dataType': 'Number', 'customFieldSpecialType': 'Number', 'isSelected': false },
  { 'columnLabel': 'Manufacturer', 'customFieldType': 'AttributeField', 'dataType': 'Text', 'customFieldSpecialType': '', 'isSelected': false },
  { 'columnLabel': 'Material', 'customFieldType': 'AttributeField', 'dataType': 'Text', 'customFieldSpecialType': '', 'isSelected': false },
  { 'columnLabel': 'Model Number', 'customFieldType': 'AttributeField', 'dataType': 'Number', 'customFieldSpecialType': 'Number', 'isSelected': false },
  { 'columnLabel': 'Part Number', 'customFieldType': 'AttributeField', 'dataType': 'Number', 'customFieldSpecialType': 'Number', 'isSelected': false },
  { 'columnLabel': 'SKU', 'customFieldType': 'AttributeField', 'dataType': 'Text', 'customFieldSpecialType': '', 'isSelected': false },
  { 'columnLabel': 'Type', 'customFieldType': 'AttributeField', 'dataType': 'Text', 'customFieldSpecialType': '', 'isSelected': false },
  { 'columnLabel': 'UPC', 'customFieldType': 'AttributeField', 'dataType': 'Number', 'customFieldSpecialType': 'Number', 'isSelected': false },
  { 'columnLabel': 'Vendor', 'customFieldType': 'AttributeField', 'dataType': 'Text', 'customFieldSpecialType': '', 'isSelected': false },
  { 'columnLabel': 'Weight', 'customFieldType': 'AttributeField', 'dataType': 'Number', 'customFieldSpecialType': 'Number', 'isSelected': false },
  ]

  public CustomField = [{ 'columnLabel': 'Purchase Order Number', 'customFieldType': 'CustomField', 'dataType': 'Number', 'customFieldSpecialType': 'Number', 'isSelected': false },
  { 'columnLabel': 'Purchase Date', 'customFieldType': 'CustomField', 'dataType': 'Date/Time', 'customFieldSpecialType': 'Date', 'isSelected': false },
  { 'columnLabel': 'Sale Order Number', 'customFieldType': 'CustomField', 'dataType': 'Number', 'customFieldSpecialType': 'Number', 'isSelected': false },
  { 'columnLabel': 'Sale Date', 'customFieldType': 'CustomField', 'dataType': 'Date/Time', 'customFieldSpecialType': 'Date', 'isSelected': false },
  { 'columnLabel': 'Sale Notes', 'customFieldType': 'CustomField', 'dataType': 'Text', 'customFieldSpecialType': 'OpenField', 'isSelected': false },
  { 'columnLabel': 'Job Number', 'customFieldType': 'AttributeField', 'dataType': 'Number', 'customFieldSpecialType': 'Number', 'isSelected': false },
  { 'columnLabel': 'Vendor', 'customFieldType': 'AttributeField', 'dataType': 'Text', 'customFieldSpecialType': 'OpenField', 'isSelected': false },
  { 'columnLabel': 'Carrier', 'customFieldType': 'AttributeField', 'dataType': 'Text', 'customFieldSpecialType': 'OpenField', 'isSelected': false },
  { 'columnLabel': 'Customer', 'customFieldType': 'AttributeField', 'dataType': 'Text', 'customFieldSpecialType': 'OpenField', 'isSelected': false },
  { 'columnLabel': 'Invoice Number', 'customFieldType': 'AttributeField', 'dataType': 'Number', 'customFieldSpecialType': 'Number', 'isSelected': false },
  { 'columnLabel': 'Order Number', 'customFieldType': 'AttributeField', 'dataType': 'Number', 'customFieldSpecialType': 'Number', 'isSelected': false },
  { 'columnLabel': 'Sale Price', 'customFieldType': 'AttributeField', 'dataType': 'Number', 'customFieldSpecialType': 'Number', 'isSelected': false },
  { 'columnLabel': 'Serial Number', 'customFieldType': 'AttributeField', 'dataType': 'Number', 'customFieldSpecialType': 'Number', 'isSelected': false },
  { 'columnLabel': 'Tracking Number', 'customFieldType': 'AttributeField', 'dataType': 'Number', 'customFieldSpecialType': 'Number', 'isSelected': false },
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

  constructor(private toastr: ToastrService, private router: Router, private authService: AuthService, private customfieldservice: CustomFieldService) { }

  ngOnInit(): void {
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    this.GetAllFields();

  }

  createField(data) {
    debugger;
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
            this.attributeFields.customFieldSpecialType = element.customFieldSpecialType
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
            this.customField.customFieldSpecialType = element.customFieldSpecialType
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
            debugger;

            this.AllFieldList = result.entity;

          }
        }
      })
  }


  CreateFields() {
    this.FieldCreation.forEach(element => {
      if (element.customFieldType == 'AttributeField') {
        this.customfieldservice.AddAttributeFields(element, this.selectedTenantId, this.authService.accessToken)
          .pipe(finalize(() => {
            // this.spinner.hide();
          }))
          .subscribe(
            result => {
              if (result) {
                if (result.code == 200) {


                  this.toastr.success("Your AttributeField  is Successfully add.");

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
      else {
        this.customfieldservice.AddCustomFields(element, this.selectedTenantId, this.authService.accessToken)
          .pipe(finalize(() => {
            // this.spinner.hide();
          }))
          .subscribe(
            result => {
              if (result) {
                if (result.code == 200) {


                  this.toastr.success("Your custom field is Successfully add.");

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
    });

  }
}
