// import { Component, OnInit, OnChanges, ViewEncapsulation, SimpleChanges, TemplateRef, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
// import { from, Observable } from 'rxjs';
// import { finalize } from 'rxjs/operators';
// import { AuthService } from '../core/auth.service';
// import { CurrentInventory, InventoryTransactionViewModel, TransactionTarget, ChangeStateFields, Tenant, DataColumnFilter } from '../currentinventory/models/admin.models'
// import { CustomFieldService } from '../customfield/service/custom-field.service'
// // import { currentinventoryService } from '../service/admin.service';
// import { LibraryService } from '../library/service/library.service';
// import { CurrentinventoryService } from '../currentinventory/service/currentinventory.service'
// import { NgxSpinnerService } from 'ngx-spinner';
// import { ToastrService } from 'ngx-toastr';
// import { CommanSharedService } from '../shared/service/comman-shared.service';
// import { HomeService } from '../home/service/home.service';
// import tables from '../../assets/js/lib/_tables';
// import toggle from '../../assets/js/lib/_toggle';
// import inputFocus from '../../assets/js/lib/_inputFocus';
// import inputClear from '../../assets/js/lib/_inputClear';
// import modal from '../../assets/js/lib/_modal';
// import datePicker from '../../assets/js/lib/_datePicker';
// import action from '../../assets/js/lib/_action';
// import trigger from '..//../assets/js/lib/_trigger';
// import dropdown from '../../assets/js/lib/_dropdown';
// import { Router } from '@angular/router';
// import { each } from 'jquery';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { EventService } from '../dynamic-events/service/event.service';
// import { CircumstanceFields, StateFields, AttributeFields } from '../customfield/models/customfieldmodel';
// import { SetSelectedTenant, SetSelectedTenantId } from '../store/actions/tenant.action';
// import { Store, select } from '@ngrx/store';
// @Component({
//   selector: 'app-add-custom-field',
//   templateUrl: './add-custom-field.component.html',
//   styleUrls: ['./add-custom-field.component.scss']
// })
// export class AddCustomFieldComponent implements OnInit {

//   constructor() { }
//   curcumstanceFields: CircumstanceFields = {
//     columnId: 0,
//     columnName: '',
//     columnLabel: '',
//     customFieldType: '',
//     dataType: '',
//     columnValue: '',
//     comboBoxValue: '',
//     customFieldIsRequired: false,
//     customFieldInformation: '',
//     customFieldPrefix: '',
//     customFieldSuffix: '',
//     customFieldIsIncremental: false,
//     customFieldBaseValue: 0,
//     customFieldIncrementBy: 0,
//     customFieldIncludeOnAdd: false,
//     customFieldIncludeOnStatus: false,
//     customFieldIncludeOnSubtract: false,
//     customFieldIncludeOnMove: false,
//     customFieldIncludeOnConvert: false,
//     customFieldIncludeOnApply: false,
//     customFieldIncludeOnMoveTagUpdate: false,
//     customFieldTextMaxLength: 0,
//     customFieldDefaultValue: '',
//     customFieldNumberMin: 0,
//     customFieldNumberMax: 0,
//     customFieldNumberDecimalPlaces: 0,
//     customFieldTrueLabel: '',
//     customFieldFalseLabel: '',
//     customFieldSpecialType: '',
//     isLineItem: false,
//     dateDefaultPlusMinus: '',
//     dateDefaultNumber: null,
//     dateDefaulInterval: '',
//     timeDefaultPlusMinus: '',
//     timeNumberOfHours: null,
//     timeNumberOFMinutes: null,
//     offsetDateFields: '',
//     offsetTimeFields: '',

//   }

//   ngOnInit(): void {
//   }
//   GetCurcumstanceFields() {
//     this.customfieldservice.GetCurcumstanceFields(this.selectedTenantId, this.authService.accessToken)
//       .pipe(finalize(() => {
//         this.busy = false;
//         this.spinner.hide();
//       })).subscribe(result => {
//         this.CircumstanceFields = [];
//         if (result.code == 200) {
//           this.CircumstanceFields = result.entity;
//         }
//       })
//   }
//   AddNewCircumstance() {
//     this.spinner.show();
//     debugger;
//     if (this.curcumstanceFields.customFieldSpecialType == "Autocomplete" || this.curcumstanceFields.customFieldSpecialType == "Dropdown") {
//       this.curcumstanceFields.comboBoxValue = this.cfdcomboValuesString;
//     }
//     if (this.selectedDatatype == "Autocomplete" || this.selectedDatatype == "Dropdown" || this.selectedDatatype == "OpenField") {
//       this.curcumstanceFields.dataType = "Text";
//     }
//     if (this.selectedDatatype == "Number" || this.selectedDatatype == "Currency") {
//       this.curcumstanceFields.dataType = "Number";
//     }
//     if (this.selectedDatatype == "Date" || this.selectedDatatype == "Date & Time" || this.selectedDatatype == "Time") {
//       this.curcumstanceFields.dataType = "Date/Time";
//     }
//     if (this.selectedDatatype == "True/False") {
//       this.curcumstanceFields.dataType = "True/False";
//     }
//     this.curcumstanceFields.customFieldSpecialType = this.selectedDatatype;
//     this.curcumstanceFields.customFieldIncludeOnAdd = true;
//     this.customfieldservice.AddCircumstanceFields(this.curcumstanceFields, this.selectedTenantId, this.authService.accessToken)
//       .pipe(finalize(() => {
//         this.spinner.hide();
//       }))
//       .subscribe(
//         result => {
//           if (result) {
//             debugger;

//             if (result.entity == true) {
//               this.toastr.success("Your circumstancefield is Successfully Add.");
//               let el: HTMLElement = this.AddCircumstanceClose.nativeElement;
//               el.click();
//               this.GetCurcumstanceFields();
//               setTimeout(function () {
//                 inputClear();
//                 inputFocus();
//                 datePicker();
//               }, 100)

//             }
//             else {
//               this.toastr.warning(result.message);
//             }
//           }
//         });
//   }

// }
