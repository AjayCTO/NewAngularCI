import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { from, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../shared/appState';
import { LibraryService } from '../../../library/service/library.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { selectSelectedTenantId, selectSelectedTenant, getTenantConfiguration } from '../../../store/selectors/tenant.selectors';
import { TenantConfig } from 'src/app/store/models/tenant.model';


import modal from '../../../../assets/js/lib/_modal';
@Component({
  selector: 'app-location-modal',
  templateUrl: './location-modal.component.html',
  styleUrls: ['./location-modal.component.scss']
})
export class LocationModalComponent implements OnInit {
  @ViewChild('AddLocationClose', { static: true }) AddLocationClose: ElementRef<HTMLElement>;
  @Output() RefreshLocation = new EventEmitter();
  public tenantConfiguration: TenantConfig;
  public selectedTenantId: number;
  constructor(private authService: AuthService, protected store: Store<AppState>, private cdr: ChangeDetectorRef, private toastr: ToastrService, private formBuilder: FormBuilder, private libraryService: LibraryService, private spinner: NgxSpinnerService,) { }
  public locationForm: FormGroup;
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
    this.locationForm = this.formBuilder.group({
      locationName: ['', Validators.required],

    })
    this.store.pipe(select(getTenantConfiguration)).subscribe(config => {
      if (config) {
        debugger
        this.tenantConfiguration = config;
      }
    });
  }

  AddNewLocation() {

    if (this.locationForm.invalid) {
      return;
    }
    this.spinner.show();
    this.locationForm.value;
    this.libraryService.AddLocation(this.selectedTenantId, this.locationForm.value, this.authService.accessToken)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {
          if (result) {


            if (result.entity == true) {
              this.toastr.success("Your Location is Successfully add.");
              this.locationForm.reset();
              let el: HTMLElement = this.AddLocationClose.nativeElement;
              el.click();
              this.RefreshLocation.emit();
            }
            else {
              this.toastr.warning(result.message);
            }
          }
        });
  }
  closeaddlocation(form) {
    form.reset();
  }
}
