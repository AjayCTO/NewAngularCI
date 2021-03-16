import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { from } from 'rxjs';
import { HomeService } from '../../service/home.service';
import { AuthService } from '../../../core/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import modal from '../../../../assets/js/lib/_modal';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../shared/appState';
import { SetSelectedTenant, SetSelectedTenantId } from '../../../store/actions/tenant.action';
@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.scss']
})
export class TenantComponent implements OnInit {
  @ViewChild('AddTenantModel', { static: true }) AddTenantModel: ElementRef<HTMLElement>;
  error: string;
  busy: boolean;
  showForm: boolean
  addForm: FormGroup;
  Tenants: any[] = [];
  AssigendTenants: any;
  submitted = false;
  TenantObject: any = { tenantId: 0, name: "", tenantColor: "", accountId: 0, createdBy: "Self" }
  constructor(protected store: Store<AppState>, private homeService: HomeService, private toast: ToastrService,
    private router: Router, private authService: AuthService, private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {

    this.spinner.show();
    this.authService.setTenantIdNotHave();
    this.GetTenants();

    modal();
    this.ApplyJsFunction();
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
    })
  }
  ApplyJsFunction() {
    setTimeout(function () {
      modal();
      inputClear();
      inputFocus();
    }, 300)
  }

  AddNewTenant() {
    debugger;
    setTimeout(() => {
      let el: HTMLElement = this.AddTenantModel.nativeElement;
      el.click();
    }, 100);

  }

  GetTenants() {
    this.homeService.GetTenants(this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
        this.spinner.hide();
      })).subscribe(result => {

        this.Tenants = result.entity;
        this.GetAssignedTenants();

      })
  }
  get f() { return this.addForm.controls; }

  onReset() {
    this.submitted = false;
    this.addForm.reset();
  }
  SelectedTenant(value: any) {


    this.store.dispatch(new SetSelectedTenant(value));
    localStorage.setItem('TenantId', JSON.stringify(value.tenantId));
    localStorage.setItem('Tenant', JSON.stringify(value));
    this.router.navigate(['CurrentInventory']);

  }

  GetAssignedTenants() {
    this.homeService.GetAssignedTenants(this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
        this.spinner.hide();
      })).subscribe(result => {

        this.AssigendTenants = result.entity;
        if (this.Tenants.length == 1) {
          if (this.AssigendTenants.length <= 0) {
            this.SelectedTenant(this.Tenants[0]);
          }
        }
      })
  }


  onSubmit() {

    this.submitted = true;
    this.TenantObject = this.addForm.value;
    this.homeService.AddTenant(this.authService.accessToken, this.TenantObject)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(

        result => {
          if (result) {

            if (result.code == 409) {
              this.toast.warning(result.message);
            }
            if (result.code == 200) {
              this.toast.success("Your tenant is Successfully add.");
              document.getElementById("CloseBtn").click();
              this.spinner.show();
              this.showForm = false;
            }
            this.GetTenants();
            this.TenantObject = { tenantId: 0, name: "", tenantColor: "", accountId: 0, createdBy: "Self" };
          }
        },
        error => {
          this.error = error;
          this.spinner.hide();
        });
  }
}
