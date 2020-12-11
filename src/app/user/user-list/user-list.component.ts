import { Component, OnInit } from '@angular/core';
import modal from '../../../assets/js/lib/_modal';
import inputFocus from '../../../assets/js/lib/_inputFocus';
import inputClear from '../../../assets/js/lib/_inputClear';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserRegistration } from '../../account/models/account-model';
import { NgxSpinnerService } from 'ngx-spinner';
import { from } from 'rxjs';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators'
import { AuthService } from '../../core/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../service/user.service';
import { ThrowStmt } from '@angular/compiler';
const emailPattern = '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,63}';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  public selectedTenantId: number;
  submitted = false;
  registerMemberForm: FormGroup;
  success: boolean;
  error: string;
  busy: boolean;
  AllMemberUser: any;
  CurrentTenantUsers: any;
  loadingRecords = false;
  AllClaims: any;
  Permissions: any;
  UserPermission: any;
  selectedUserId: any;
  isLoadingResult: boolean;
  FoundUser: any;
  keyword = 'userName';
  IsSelectedUser: boolean;
  userRegistration: UserRegistration = { firstName: '', lastName: '', company: '', phone: '', email: '', password: '' };
  SelectedUser = {
    userName: '', userId: '', firstName: '', lastName: '', company: '', phone: '', email: ''
  }
  constructor(private authService: AuthService, private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder, private toastr: ToastrService, private userService: UserService) {

    this.Permissions = [];
  }

  ngOnInit(): void {
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    modal();
    this.registerMemberForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [null, Validators.compose([Validators.required, Validators.email, Validators.pattern(emailPattern)])],
      company: ['', Validators.required],
      phone: [null, Validators.required],
      password: [null, Validators.required],
    });
    this.GetCurrentTenantUsers();
    this.GetAllClaims();
    this.ApplyJsFunction();
  }
  onReset() {
    this.submitted = false;
    this.registerMemberForm.reset();

  }
  ApplyJsFunction() {
    setTimeout(function () {
      inputFocus();
      inputClear();

    }, 700)
  }
  get f() { return this.registerMemberForm.controls; }
  onSubmit() {

    this.submitted = true;
    if (this.registerMemberForm.invalid) {
      this.toastr.warning("Form is Invalid.")
      return;
    }
    this.userRegistration = this.registerMemberForm.value;
    this.userService.RegisterMemberUser(this.authService.accessToken, this.userRegistration)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {
          if (result) {


            this.toastr.success("Success!", "Member succcefully register");
            this.onReset();
            document.getElementById("Closebtn").click();
            this.GetMemberUser();
            //this.userRegistration = { firstName: '', lastName: '', company: '', phone: '', email: '', password: '' };;
          }
        },
        error => {
          this.error = error;
          this.spinner.hide();
        });
  }

  GetMemberUser() {
    this.loadingRecords=true;
    this.userService.GetMemberUser(this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;

      })).subscribe(result => {
        if (result.entity != null) {
          this.loadingRecords=false;
          this.AllMemberUser = result.entity;

        }
      })

  }
  getexistingUser(event) {


    if (event != "") {
      this.isLoadingResult = true;

      this.userService.GetUserWithTerm(event, this.authService.accessToken)
        .subscribe(response => {

          this.FoundUser = response.entity;
          this.isLoadingResult = false;
        });
    }

  }
  onSubmitPermission(UserId) {

    let data = {
      "UserId": this.selectedUserId,
      "Permissions": this.Permissions
    }

    this.userService.UpdateMemberUserPermission(this.selectedTenantId, data, this.authService.accessToken)
      .pipe(finalize(() => {

      }))
      .subscribe(
        result => {
          if (result.code == 200) {
            this.GetCurrentTenantUsers();
            this.toastr.success("Update Successfully");
          }
        })

  }


  RemoveTenantUser(Id) {
    this.userService.RemoveTenantUser(this.selectedTenantId, Id, this.authService.accessToken)
      .pipe(finalize(() => {

      }))
      .subscribe(
        result => {
          if (result.code == 200) {
            this.GetCurrentTenantUsers();
            this.toastr.success("Remove Successfully");

          }
        })
  }

  GetCurrentTenantUsers() {
    this.loadingRecords=true;
    this.userService.GetCurrentTenantUsers(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;

      })).subscribe(result => {

        if (result.entity != null) {
          this.loadingRecords=false;
          this.CurrentTenantUsers = result.entity;
          this.CurrentTenantUsers.sort(function (a, b) { return a.id - b.id; });
          this.GetMemberUser();
        }
      })
  }






  GetAllClaims() {
    this.userService.GetAllClaims(this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;

      })).subscribe(result => {

        if (result.entity != null) {
          this.AllClaims = result.entity;
          this.FillPermissionObject();
        }
      });
  }

  FillPermissionObject() {
    this.Permissions = [];
    this.AllClaims.forEach(element => {
      let obj = {};
      obj["permissionName"] = element.value;
      obj["isAssign"] = false;
      this.Permissions.push(obj);
    });
  }


  TenantUserPermission(item) {
    this.spinner.show();
    this.FillPermissionObject();
    this.GetMemberUserPermissionwithTenanId(item.userId);
    setTimeout(() => {
      this.CurrentTenantUsers.forEach(element => {
        if (item.id != element.id)
          element.isActive = false;
      });
      item.isActive = !item.isActive;
      this.selectedUserId = item.userId;
      this.spinner.hide();
    }, 500);
  }

  CloseForm(item) {

    item.isActive = !item.isActive;
  }

  GetMemberUserPermissionwithTenanId(UserId) {

    this.userService.GetMemberUserPermissionwithTenanId(UserId, this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;

      })).subscribe(result => {

        if (result.entity != null) {
          this.UserPermission = result.entity[0];
          if (this.UserPermission.permissionObject != null) {

            this.UserPermission.permissionObject.forEach(element => {

              this.Permissions.forEach(Permission => {
                if (element.permissionName == Permission.permissionName) {
                  Permission.isAssign = element.isAssign;
                }
              });

            });
            // this.Permissions = this.UserPermission.permissionObject;
          }
        }
      })
  }
  selectEvent(item) {
    this.SelectedUser = item;
    this.IsSelectedUser = true;
  }

  AssociateWithTenant(UserId) {

    this.spinner.show();
    let data = {
      "UserId": UserId
    }
    this.userService.AssociateWithTenant(this.selectedTenantId, data, this.authService.accessToken)
      .pipe(finalize(() => {

      }))
      .subscribe(
        result => {
          if (result.code == 200) {

            if (result.entity == false) {
              this.toastr.warning("Warning!", result.message);
            }
            else {
              document.getElementById("CloseExistUser").click();
              this.toastr.success("Success!", "Member succcefully added");
              this.SelectedUser = {
                userName: '', userId: '', firstName: '', lastName: '', company: '', phone: '', email: ''
              }
              this.IsSelectedUser = false;
            }

            this.GetCurrentTenantUsers();
          }
        })
  }

}
