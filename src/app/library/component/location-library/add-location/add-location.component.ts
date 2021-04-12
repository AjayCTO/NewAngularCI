import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { LibraryService } from '../../../service/library.service';
import { AuthService } from '../../../../core/auth.service';
import { finalize } from 'rxjs/operators'
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import inputFocus from '../../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../../assets/js/lib/_inputClear';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../shared/appState';
import { TenantConfig } from 'src/app/store/models/tenant.model';
import { selectSelectedTenantId, selectSelectedTenant, getTenantConfiguration } from '../../../../store/selectors/tenant.selectors';
@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss']
})
export class AddLocationComponent implements OnInit {
  public tenantConfiguration: TenantConfig;
  locationForm: FormGroup;
  public selectedTenantId: number;
  @Output() hideClose = new EventEmitter();
  @Output() loadLocation = new EventEmitter();



  constructor(private formBuilder: FormBuilder, private libraryService: LibraryService, private toast: ToastrService, protected store: Store<AppState>, private cdr: ChangeDetectorRef, private spinner: NgxSpinnerService, private authService: AuthService) { }

  ngOnInit(): void {
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    this.locationForm = this.formBuilder.group({
      locationName: ['', Validators.required],
      description: ['', null],
      locationZone: ['', null],
    });
    this.store.pipe(select(getTenantConfiguration)).subscribe(config => {
      if (config) {
        debugger
        this.tenantConfiguration = config.entity;
      }
    });
    inputClear();
    inputFocus();
  }

  onSubmit() {

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
              this.toast.success("Your Location Is Successfully Add.");
              this.loadLocation.emit();

            }
            else {
              this.toast.warning(result.message);
            }



          }

        },
        error => {


          this.spinner.hide();
        });
  }




  close() {
    this.hideClose.emit(false);
  }

  onReset() {

  }

}
