import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import modal from '../../../../assets/js/lib/_modal';
import { CustomFieldService } from '../../../customfield/service/custom-field.service'
import { CircumstanceFields, StateFields, AttributeFields, CustomFields } from '../../../customfield/models/customfieldmodel';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../shared/appState';
@Component({
  selector: 'app-custom-field-modal',
  templateUrl: './custom-field-modal.component.html',
  styleUrls: ['./custom-field-modal.component.scss']
})
export class CustomFieldModalComponent implements OnInit {
  @ViewChild('AddCustomFieldClose', { static: true }) AddCustomFieldClose: ElementRef<HTMLElement>;
  @Output() RefreshCustomField = new EventEmitter();
  public selectedTenantId: number;
  public CustomFields: any;
  public busy: boolean;
  public cfdcomboValuesString: string;
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

  public datatype: any = ['OpenField', 'Dropdown', 'Autocomplete', 'Number', 'Currency', 'Date', 'Date & Time', 'Time', 'True/False']
  public selectedDatatype: string;
  constructor(private toastr: ToastrService, protected store: Store<AppState>, private authService: AuthService, private spinner: NgxSpinnerService, private customfieldservice: CustomFieldService) { }

  ngOnInit(): void {
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    modal();
  }
  // custom fields new add
  AddNewCustomfield() {
    this.spinner.show();

    if (this.customField.customFieldSpecialType == "Autocomplete" || this.customField.customFieldSpecialType == "Dropdown") {
      this.attributeFields.comboBoxValue = this.cfdcomboValuesString;
    }
    if (this.selectedDatatype == "Autocomplete" || this.selectedDatatype == "Dropdown" || this.selectedDatatype == "OpenField") {
      this.customField.dataType = "Text";
    }
    if (this.selectedDatatype == "Number" || this.selectedDatatype == "Currency") {
      this.customField.dataType = "Number";
    }
    if (this.selectedDatatype == "Date" || this.selectedDatatype == "Date & Time" || this.selectedDatatype == "Time") {
      this.customField.dataType = "Date/Time";
    }
    if (this.selectedDatatype == "True/False") {
      this.customField.dataType = "True/False";
    }
    this.customField.customFieldSpecialType = this.selectedDatatype;
    this.customfieldservice.AddCustomFields(this.customField, this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {
          if (result) {


            if (result.entity == true) {
              this.toastr.success("Your customField is Successfully Add.");
              let el: HTMLElement = this.AddCustomFieldClose.nativeElement;
              el.click();
              // this.GetCustomFields();
              this.RefreshCustomField.emit();
              // form.reset();
              // this.GetAttributeFields();

              // setTimeout(function () {
              //   inputClear();
              //   inputFocus();
              //   datePicker();
              // }, 500)
            }
            else {
              this.toastr.warning(result.message);
            }
          }
        });
  }

  closeCustomField(form) {
    form.reset();
  }
  ComboValueDropdown(Value) {
    let items = [];
    if (Value != null) {
      items = Value.split('\n')
    }
    return items;
  }
}
