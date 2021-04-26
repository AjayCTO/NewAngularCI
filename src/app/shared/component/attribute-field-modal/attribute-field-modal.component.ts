import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import modal from '../../../../assets/js/lib/_modal';
import { CustomFieldService } from '../../../customfield/service/custom-field.service'
import { CircumstanceFields, StateFields, AttributeFields, CustomFields } from '../../../customfield/models/customfieldmodel';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../shared/appState';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import datePicker from '../../../../assets/js/lib/_datePicker';
import { selectSelectedTenantId, selectSelectedTenant, selectMyInventoryColumn, getTenantConfiguration } from '../../../store/selectors/tenant.selectors';

@Component({
  selector: 'app-attribute-field-modal',
  templateUrl: './attribute-field-modal.component.html',
  styleUrls: ['./attribute-field-modal.component.scss']
})
export class AttributeFieldModalComponent implements OnInit {
  @ViewChild('AddAttributeClose', { static: true }) AddAttributeClose: ElementRef<HTMLElement>;
  @Output() RefreshAttributeField = new EventEmitter();
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
  public datatype: any = ['OpenField', 'Dropdown', 'Autocomplete', 'Number', 'Currency', 'Date', 'Date & Time', 'Time', 'True/False']
  public selectedDatatype: string;
  constructor(private toastr: ToastrService, protected store: Store<AppState>, private authService: AuthService, private spinner: NgxSpinnerService, private customfieldservice: CustomFieldService, private cdr: ChangeDetectorRef) { }


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
  }

  //New Attribute Fields 
  AddNewAttribute(form) {
    this.spinner.show();

    if (this.attributeFields.customFieldSpecialType == "Autocomplete" || this.attributeFields.customFieldSpecialType == "Dropdown") {
      this.attributeFields.comboBoxValue = this.cfdcomboValuesString;
    }
    if (this.selectedDatatype == "Autocomplete" || this.selectedDatatype == "Dropdown" || this.selectedDatatype == "OpenField") {
      this.attributeFields.dataType = "Text";
    }
    if (this.selectedDatatype == "Number" || this.selectedDatatype == "Currency") {
      this.attributeFields.dataType = "Number";
    }
    if (this.selectedDatatype == "Date" || this.selectedDatatype == "Date & Time" || this.selectedDatatype == "Time") {
      this.attributeFields.dataType = "Date/Time";
    }
    if (this.selectedDatatype == "True/False") {
      this.attributeFields.dataType = "True/False";
    }
    this.attributeFields.customFieldSpecialType = this.selectedDatatype;
    this.customfieldservice.AddAttributeFields(this.attributeFields, this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {
          if (result) {


            if (result.entity == true) {
              this.toastr.success("Your Attribute is Successfully Add.");
              let el: HTMLElement = this.AddAttributeClose.nativeElement;
              el.click();
              form.reset();
              this.RefreshAttributeField.emit();
              // this.GetAttributeFields();
              setTimeout(function () {
                inputClear();
                inputFocus();
                datePicker();
              }, 500)

            }
            else {
              this.toastr.warning(result.message);
            }
          }
        });

  }
  Close1(form) {
    form.reset();
  }
}
