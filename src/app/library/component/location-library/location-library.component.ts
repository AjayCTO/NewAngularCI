import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LibraryService } from '../../service/library.service';
import { AuthService } from '../../../core/auth.service';
import { finalize } from 'rxjs/operators'
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '../../models/library-model';
import { ToastrService } from 'ngx-toastr';
import modal from '../../../../assets/js/lib/_modal';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { AppState } from '../../../shared/appState';
import { Router, Routes } from '@angular/router';
import { selectSelectedTenantId, selectSelectedTenant } from '../../../store/selectors/tenant.selectors';
@Component({
  selector: 'app-location-library',
  templateUrl: './location-library.component.html',
  styleUrls: ['./location-library.component.scss']
})
export class LocationLibraryComponent implements OnInit {

  locationsform: Location = { locationId: 0, locationName: '', description: '', locationZone: '', isHidden: false };
  showForm: boolean
  busy: boolean;
  error: string;

  public locations: any[] = [];
  public istableloaded = false;
  public selectedTenantId: number;
  public selectedId: number;
  public isActive: boolean;
  public EditMode: boolean;
  loadingRecords = false;
  public NotPermitted: boolean = false;
  locationForm: FormGroup;
  editlocationForm: FormGroup;
  submitted = false;
  addLocation = false;
  deleteLocation = false;
  constructor(private router: Router, protected store: Store<AppState>, private formBuilder: FormBuilder, private libraryService: LibraryService, private toast: ToastrService, private cdr: ChangeDetectorRef, private spinner: NgxSpinnerService, private authService: AuthService) {

  }
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex = 0;
  lastPageIndex = 0;

  ngOnInit(): void {

    debugger;
    this.store.pipe(select(selectSelectedTenantId)).
      subscribe(eventId => {
        if (eventId) {
          debugger;
          this.selectedTenantId = eventId;
        }
        this.cdr.detectChanges();
      });

    this.locationForm = this.formBuilder.group({
      locationName: ['', Validators.required],
      description: ['', null],
      locationZone: ['', null],
    });

    this.spinner.show();

    // this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    this.GetLocation();
    this.EditMode = false;
    modal();
    this.AddJsFunction();
  }

  get f() { return this.locationForm.controls; }
  onReset() {
    this.submitted = false;
    this.locationForm.reset();
  }
  GetLocation() {
    debugger;
    this.addLocation = false;
    this.istableloaded = false;

    this.loadingRecords = true;
    this.libraryService.GetLocation(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
        this.spinner.hide();
      })).subscribe(result => {
        if (result.code == 403) {
          this.router.navigateByUrl('/notPermited');
        }
        else {
          if (result.entity != null) {
            this.loadingRecords = false;
            this.locations = result.entity;
            this.length = result.entity.length;
          }
        }

        this.locations.forEach(element => {
          element.isActive = false;
        })
        debugger;
        this.istableloaded = true;
        this.cdr.markForCheck();
        modal();
      })
  }
  OpenMenu(item) {
    debugger;
    this.locations.forEach(element => {
      if (item.locationId != element.locationId)
        element.isActive = false;
    });
    item.isActive = !item.isActive;
    this.locationsform = item;
    this.EditMode = true;
    this.AddJsFunction();
  }


  getValue(value: boolean) {
    const html = document.querySelector('html');
    html.classList.remove('js-modal-page');
    this.addLocation = false;
  }


  CloseMenu(item) {
    item.isActive = false;
  }
  onSubmit() {
    debugger;
    if (this.EditMode) {
      this.libraryService.EditLocation(this.selectedTenantId, this.locationsform.locationId, this.locationsform, this.authService.accessToken)
        .pipe(finalize(() => {

          this.spinner.hide();
        }))
        .subscribe(
          result => {
            if (result) {

              if (result.entity == true) {
                this.toast.success("Your Location is Successfully update.");
                this.GetLocation();
                this.locationsform = { locationId: 0, locationName: '', description: '', locationZone: '', isHidden: false };
              }
              else {
                this.toast.warning(result.message);
              }

            }
          },
          error => {
            debugger;
            this.error = error.error.message;
            this.spinner.hide();
          });
    }

  }
  deleteField() {
    debugger;
    this.spinner.show();
    this.libraryService.Deletelocation(this.selectedTenantId, this.selectedId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {
          debugger;
          if (result.code == 403) {
            this.toast.warning(result.message);
          }
          else {
            if (result) {
              this.toast.success("Successfully Delete.")
              this.GetLocation();

            }
          }
        },
        error => {

          this.error = error.error.message;
          alert(this.error);
          this.spinner.hide();
        });
  }
  AddJsFunction() {
    setTimeout(function () {
      inputClear();
      inputFocus();
    }, 30)
  }
  OpenModal() {
    this.error = "";
    this.locationsform = { locationId: 0, locationName: '', description: '', locationZone: '', isHidden: false };
    this.EditMode = false;
    this.showForm = true;
    this.locations.forEach(element => {
      element.isActive = false;
    });
    this.addLocation = true;
  }
  DeleteConfirm(item) {
    debugger;
    this.selectedId = item.locationId;
    this.deleteLocation = true;
  }
  deleteValue(value: boolean) {
    const html = document.querySelector('html');
    html.classList.remove('js-modal-page');
    this.deleteLocation = false;
  }
  gotoFirstPage() {
    this.pageIndex = 0;
    this.GetLocation();
  }
  gotoLastPage() {

    this.pageIndex = this.length / this.pageSize;
    this.pageIndex = parseInt(this.pageIndex.toString())
    this.GetLocation();
  }
  gotoNext() {
    debugger;
    this.lastPageIndex = this.length / this.pageSize;
    this.lastPageIndex = parseInt(this.lastPageIndex.toString())
    if (this.pageIndex != this.lastPageIndex) {
      this.pageIndex++;
      this.GetLocation();
    }
  }
  gotoBack() {
    if (this.pageIndex > 0) {
      this.pageIndex = this.pageIndex - 1;
      this.GetLocation();
    }
  }
}
