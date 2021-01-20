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
@Component({
  selector: 'app-inventory-report',
  templateUrl: './inventory-report.component.html',
  styleUrls: ['./inventory-report.component.scss']
})
export class InventoryReportComponent implements OnInit {
  selectedTenantId: number = 0;
  loadingRecords: boolean = false;
  customFields: any = [];
  customFieldslength: number = 0;
  NotPermitted: boolean = false;

  public EventFormToPlayWith = {
    heading: '',
    title: '',
    selectedFields: [],
    selectedButtons: [],
    backgroundColor: '#ddd'
  };




  constructor(private spinner: NgxSpinnerService, private customFieldService: CustomFieldService, protected store: Store<AppState>, private authService: AuthService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.store.pipe(select(selectSelectedTenantId)).
      subscribe(eventId => {
        if (eventId) {
          this.selectedTenantId = eventId;
          this.GetCustomFields();
          this.cdr.detectChanges();
        }
      });

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

    this.EventFormToPlayWith.selectedFields.push(e.dragData);

    this.cdr.detectChanges();
    this.ApplyJsFunction();
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
            this.customFieldslength = result.entity.length;
          }
        }
      })
  }
}
