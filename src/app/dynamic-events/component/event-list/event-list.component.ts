import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../core/auth.service';
import { finalize } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { AppState } from '../../../shared/appState';
import { selectSelectedTenantId, selectSelectedTenant } from '../../../store/selectors/tenant.selectors';
import { EventService } from '../../service/event.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import modal from '../../../../assets/js/lib/_modal';
import { DynamicEvents } from '../../models/event-models';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import { CustomFieldService } from '../../../customfield/service/custom-field.service';
@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {

  color;
  public SelectedIcon = "0";
  public selectedTenantId: number;
  public busy: boolean;
  public error: string;
  public NotPermitted: boolean = false;
  public EventList: any;
  public DeleteConfirmPopup: boolean;
  public selectedEventItem: any;
  public CustomFields: any;
  public checklist: any;
  public checkedList: any;
  loadingRecords = false;
  public masterSelected: boolean;
  public checklistObj = {
    id: 0, columnName: '', columnLabel: '', isSelected: false
  }
  eventForm: DynamicEvents = {
    id: 0,
    eventName: '',
    eventColor: '',
    eventIcon: '',
    withNewRecord: false,
    withExistRecord: false,
    islocationRequired: false,
    isUOMRequired: false,
    eventQuantityAction: 'Add',
    circumstanceColumnRequired: []

  };
  constructor(protected store: Store<AppState>, private eventService: EventService, private customfieldservice: CustomFieldService, private toastr: ToastrService, private cdr: ChangeDetectorRef, private spinner: NgxSpinnerService, private authService: AuthService) {
    this.masterSelected = false;
  }

  ngOnInit(): void {

    this.masterSelected = false;
    this.NotPermitted = false;
    this.spinner.show();
    this.store.pipe(select(selectSelectedTenantId)).
      subscribe(eventId => {
        if (eventId) {
          debugger;
          this.selectedTenantId = eventId;
        }
      });

    modal();
    this.GetCustomFields()
    this.GetEvents();

  }

  GetEvents() {
    debugger;
    this.loadingRecords = true;
    this.eventService.GetEvents(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
        this.spinner.hide();
      })).subscribe(result => {
        if (result.code == 403) {
          this.NotPermitted = true;
        }

        else {

          if (result.entity != null) {
            debugger;
            this.loadingRecords = false;
            this.EventList = result.entity;

            // this.EventList.forEach(element => {
            //   let obj = {}
            //   obj = JSON.parse(element.circumstanceJsonString);

            //   this.checklist.forEach(element12 => {
            //     element12.isSelected = obj[element12.columnName];
            //   });

            // });
          }
        }
      })
  }



  deleteItem(id) {
    this.spinner.show();

    this.eventService.DeleteEvent(id, this.authService.accessToken)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {

          if (result.code == 403) {
            this.toastr.warning(result.message);
          }
          else {
            if (result) {
              this.DeleteConfirmPopup = false;
              this.toastr.success("Successfully Delete.");

              this.GetEvents();
            }
          }

        },
        error => {
          this.error = error;
          this.spinner.hide();
        });
  }
  GetCustomFields() {
    this.customfieldservice.GetCustomFields(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
        this.spinner.hide();
      })).subscribe(result => {

        if (result.code == 403) {
          this.NotPermitted = true;
        }
        else {
          debugger;
          if (result.entity != null) {
            this.CustomFields = result.entity;
            this.checklist = [];
            this.CustomFields.forEach(element => {
              this.checklistObj = {
                id: element.columnId,
                columnName: element.columnName,
                columnLabel: element.columnLabel,
                isSelected: false,
              }
              this.checklist.push(this.checklistObj);

            });
          }
        }
      })
  }
  onSubmit() {
    debugger;
    this.eventForm.eventIcon = this.SelectedIcon.toString();
    this.eventForm.circumstanceColumnRequired = this.checklist;
    this.eventService.EditEvent(this.selectedTenantId, this.eventForm.id, this.eventForm, this.authService.accessToken)
      .pipe(finalize(() => {

        this.spinner.hide();
      }))
      .subscribe(
        result => {
          if (result) {
            if (result.entity == true) {
              this.toastr.success("Your Event is Successfully Update.");
              this.GetEvents();
              this.eventForm = {
                id: 0,
                eventName: '',
                eventColor: '',
                eventIcon: '',
                eventQuantityAction: 'Add',
                islocationRequired: false,
                withNewRecord: false,
                withExistRecord: false,
                isUOMRequired: false,
                circumstanceColumnRequired: []
              };

            }
            else {
              this.toastr.warning(result.message);
            }

          }
        },
        error => {
          this.error = error.error.message;
          this.spinner.hide();
        });


  }
  checkUncheckAll() {
    debugger;
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].isSelected = this.masterSelected;
    }
  }
  isAllSelected() {
    debugger;
    this.masterSelected = this.checklist.every(function (item: any) {
      return item.isSelected == true;
    })
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    this.checkedList = [];
    for (var i = 0; i < this.checklist.length; i++) {
      if (this.checklist[i].isSelected)
        this.checkedList.push(this.checklist[i]);
    }
  }
  OpenMenu(item) {
    debugger;
    this.EventList.forEach(element => {
      if (item.id != element.id)
        element.isActive = false;
    });
    item.isActive = !item.isActive;
    this.eventForm = item;
    let obj = {}
    obj = JSON.parse(item.circumstanceJsonString);

    this.checklist.forEach(element => {
      element.isSelected = false;
      element.isSelected = obj[element.columnName];
    });
    this.SelectedIcon = this.eventForm.eventIcon;
    this.AddJsFunction();
  }
  DeleteConfirm(item) {
    this.selectedEventItem = item;
    this.DeleteConfirmPopup = true;
  }
  ClosePopup() {
    this.DeleteConfirmPopup = false;
  }

  AddJsFunction() {
    setTimeout(function () {
      inputClear();
      inputFocus();
    }, 30)
  }
  CloseMenu(item) {
    item.isActive = false;
  }

  SelectedEvent(type) {
    this.SelectedIcon = type;
  }
}
