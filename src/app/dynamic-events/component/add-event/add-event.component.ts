import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import toggle from '../../../../assets/js/lib/_toggle';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import modal from '../../../../assets/js/lib/_modal';
import datePicker from '../../../../assets/js/lib/_datePicker';
import { Form, FormBuilder, FormGroup, FormControl, Validators, } from '@angular/forms';
import { EventService } from '../../service/event.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../core/auth.service';
import { finalize } from 'rxjs/operators'
import { DynamicEvents } from '../../models/event-models';
import { CustomFieldService } from '../../../customfield/service/custom-field.service';
@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {
  @Input() selectedTenantId
  @Output() RefreshEventList = new EventEmitter();
  @ViewChild('AddEventClose', { static: true }) AddEventClose: ElementRef<HTMLElement>;
  color;
  public SelectedIcon = "1";
  public eventformControl: FormGroup;
  public submitted = false;
  public busy: boolean;
  public error: string;
  public NotPermitted: boolean = false;
  public CustomFields: any;
  public masterSelected: boolean;
  public checklist: any;
  public checkedList: any;
  public checklistObj = {
    id: 0, columnName: '', columnLabel: '', isSelected: false
  }
  eventForm: DynamicEvents = {
    id: 0,
    eventName: '',
    eventColor: '',
    eventIcon: '',
    islocationRequired: false,
    isUOMRequired: false,
    withNewRecord: false,
    withExistRecord: false,
    eventQuantityAction: 'Add',
    circumstanceColumnRequired: []
  };
  constructor(private formBuilder: FormBuilder, private eventService: EventService, private customfieldservice: CustomFieldService, private toastr: ToastrService, private spinner: NgxSpinnerService, private authService: AuthService) {
    this.masterSelected = false;

  }

  ngOnInit(): void {
    this.masterSelected = false;
    this.eventformControl = this.formBuilder.group({
      eventName: ['', Validators.required],
      eventColor: ['', Validators.required],
      eventIcon: ['', Validators.required],
      eventQuantityAction: ['', Validators.required]
    });
    this.GetCustomFields()
    modal();
    this.ApplyJsFunction();
  }

  onChangeColorCmyk(event) {
    this.eventForm.eventColor = event;
  }

  ApplyJsFunction() {
    setTimeout(function () {
      inputClear();
      inputFocus();
    }, 1000)
  }
  onReset() {
    this.submitted = false;
    this.eventformControl.reset();
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
    this.submitted = true;
    // if (this.eventformControl.invalid) {
    //   this.toastr.warning("Required", "Please fill required column");
    //   return;
    // }
    this.spinner.show();
    // this.eventForm = this.eventformControl.value;
    this.eventForm.eventIcon = this.SelectedIcon.toString();
    this.eventForm.circumstanceColumnRequired = this.checklist;
    this.eventService.AddEvent(this.selectedTenantId, this.eventForm, this.authService.accessToken).pipe(finalize(() => {
      this.spinner.hide();
    }))
      .subscribe(
        result => {
          if (result) {

            if (result.entity == true) {
              this.onReset();

              this.toastr.success("Your event is Successfully Added.");
              let el: HTMLElement = this.AddEventClose.nativeElement;
              el.click();
              this.RefreshEventList.emit();
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

  SelectedEvent(type) {
    debugger;
    this.SelectedIcon = type;
  }
  // Clear form 
  clearform(form){
    form.reset();
  }
}
