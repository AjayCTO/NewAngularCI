import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CustomFieldService } from '../../../customfield/service/custom-field.service';
import { AppState } from '../../../shared/appState';
import { select, Store } from '@ngrx/store';
import { AuthService } from '../../../core/auth.service';
import { selectSelectedTenantId, selectSelectedTenant } from '../../../store/selectors/tenant.selectors';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import datePicker from '../../../../assets/js/lib/_datePicker';
import { DynamicEvents } from '../../../dynamic-events/models/event-models';
import { ToastrService } from 'ngx-toastr';
import modal from '../../../../assets/js/lib/_modal';
import { EventService } from '../../../dynamic-events/service/event.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-inventory-report',
  templateUrl: './inventory-report.component.html',
  styleUrls: ['./inventory-report.component.scss']
})
export class InventoryReportComponent implements OnInit {
  selectedTenantId: number = 0;
  public submitted = false;
  public busy: boolean;
  public error: string;
  loadingRecords: boolean = false;
  customFields: any = [];
  customFieldslength: number = 0;
  NotPermitted: boolean = false;
  color = "Black";
  public selectedFields: any = [];
  public SelectedIcon = "1";


  eventForm: DynamicEvents = {
    id: 0,
    eventName: '',
    eventColor: '',
    eventIcon: '',
    islocationRequired: false,
    isUOMRequired: false,
    withNewRecord: false,
    withExistRecord: true,
    eventQuantityAction: 'Add',
    customFieldsRequired: []
  };

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectedFields, event.previousIndex, event.currentIndex);
  }


  constructor(private spinner: NgxSpinnerService, private eventService: EventService, private toastr: ToastrService, private customFieldService: CustomFieldService, protected store: Store<AppState>, private authService: AuthService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.store.pipe(select(selectSelectedTenantId)).
      subscribe(eventId => {
        if (eventId) {
          this.selectedTenantId = eventId;
          this.GetCustomFields();
          this.cdr.detectChanges();
        }
      });
    modal();
  }
  ApplyJsFunction() {
    setTimeout(function () {
      inputClear();
      inputFocus();
      datePicker();
    }, 300)
  }
  onItemDrop(e: any) {
    // Get the dropped data here
    debugger;

    let IsExist = false;
    this.selectedFields.forEach(element => {


      if (element.columnId == e.dragData.columnId) {
        IsExist = true;
      }
    });
    if (!IsExist) {
      e.dragData.isSelected = true;
      this.selectedFields.push(e.dragData);
    }
    else {
      this.toastr.warning("this fields already have in Form ");
    }
    this.cdr.detectChanges();
    this.ApplyJsFunction();
  }


  removeField(index) {
    debugger;
    this.selectedFields.splice(index, 1);

  }

  onSubmit() {
    debugger;
    this.submitted = true;
    // if (this.eventformControl.invalid) {
    //   this.toastr.warning("Required", "Please fill required column");
    //   return;
    // }

    if (this.eventForm.eventName == "") {
      this.toastr.warning("event name is required");
      return false;
    }

    this.spinner.show();
    // this.eventForm = this.eventformControl.value;
    this.eventForm.eventIcon = this.SelectedIcon.toString();
    this.eventForm.eventColor = this.color;
    if (this.eventForm.eventQuantityAction == 'Add') {
      this.eventForm.withNewRecord = true;
    }
    if (this.eventForm.eventQuantityAction == 'Move') {
      this.eventForm.islocationRequired = true;

    }
    if (this.eventForm.eventQuantityAction == 'Convert') {
      this.eventForm.isUOMRequired = true;
    }
    this.eventForm.customFieldsRequired = this.selectedFields;
    this.eventService.AddEvent(this.selectedTenantId, this.eventForm, this.authService.accessToken).pipe(finalize(() => {
      this.spinner.hide();
    }))
      .subscribe(
        result => {
          if (result) {

            if (result.entity == true) {

              this.toastr.success("Your event is Successfully Added.");

            }
            else {
              this.toastr.warning(result.message);
            }
          }
        },
        error => {
          this.error = error;
          this.spinner.hide();
        });
  }
  SelectedEvent(type) {
    debugger;
    this.SelectedIcon = type;
  }
  /**
   * getAllCustomeFields
   */
  GetCustomFields() {
    this.loadingRecords = true;
    this.customFieldService.GetCustomFields(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        //this.busy = false;
        this.spinner.hide();
      })).subscribe(result => {
        if (result.code == 403) {
          this.NotPermitted = true;
        }
        else {
          if (result.entity != null) {
            this.loadingRecords = false;
            debugger;
            this.customFields = result.entity;
            this.customFields.forEach(element => {
              if (element.comboBoxValue != "") {
                element.comboBoxArray = JSON.parse(element.comboBoxValue);
              }
            });
            this.customFieldslength = result.entity.length;
          }
        }
      })
  }
}
