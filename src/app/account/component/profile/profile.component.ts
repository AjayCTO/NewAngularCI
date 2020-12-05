import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { from } from 'rxjs';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators'
import { AuthService } from '../../../core/auth.service';
import { AccountService } from '../../service/account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import inputClear from '../../../../assets/js/lib/_inputClear';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import { Router, ActivatedRoute } from '@angular/router';
const emailPattern = '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,63}';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {


  busy: boolean;
  NonMembers: any;
  ProfileData: any;
  submitted = false;
  profileForm: FormGroup;
  public ShowProfileManage: boolean;
  Profile = {
    userName: '', firstName: '', lastName: '', company: '', phone: '', email: ''
  }
  ChangePasswordModel = {
    OldPassword: '',
    NewPassword: ''
  }

  constructor(private authService: AuthService, private spinner: NgxSpinnerService, private router: Router, private accountService: AccountService,
    private formBuilder: FormBuilder, private toastr: ToastrService,) { }



  ngOnInit(): void {
    this.authService.getUserClaims();
    this.authService.setTenantIdNotHave();
    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      company: ['', Validators.required],
      phone: [null, Validators.required],
      email: [null, Validators.compose([Validators.required, Validators.email, Validators.pattern(emailPattern)])]
    });


    this.authService.getUserClaims();
    this.profileForm.controls['firstName'].setValue(this.FirstName);
    this.profileForm.controls['lastName'].setValue(this.LastName);
    this.profileForm.controls['company'].setValue(this.Company);
    this.profileForm.controls['phone'].setValue(this.Phone);
    this.profileForm.controls['email'].setValue(this.Email);
    this.ApplyJsFunction();
  }

  ApplyJsFunction() {
    setTimeout(function () {
      inputClear();
      inputFocus();
    }, 500)
  }
  get f() { return this.profileForm.controls; }


  UpdateProfileData() {
    this.authService.getUserClaims();
    this.profileForm.controls['firstName'].setValue(this.Profile.firstName);
    this.profileForm.controls['lastName'].setValue(this.Profile.lastName);
    this.profileForm.controls['company'].setValue(this.Profile.company);
    this.profileForm.controls['phone'].setValue(this.Profile.phone);
    this.profileForm.controls['email'].setValue(this.Email);
    this.ApplyJsFunction();
  }



  onSubmit() {
    this.submitted = true;
    if (this.profileForm.invalid) {
      this.toastr.warning("Form is Invalid.")
      return;
    }
    this.spinner.show();
    this.Profile = this.profileForm.value;
    this.accountService.UpdateProfile(this.Profile, this.authService.accessToken)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {
          if (result.code == 200) {

            if (result.entity == false) {

              this.toastr.error(result.message);
            }
            else {
              this.toastr.success("Your profile is Successfully update.");
              this.UpdateProfileData();
            }
            this.ChangePasswordModel = {
              OldPassword: "", NewPassword: ""
            }
          }
        })
  }
  Changepassword() {
    this.spinner.show();
    this.accountService.ChangePassowrd(this.ChangePasswordModel, this.authService.accessToken)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {
          if (result.code == 200) {

            if (result.entity == false) {

              this.toastr.error(result.message);
            }
            else {
              this.toastr.success("Your password is Successfully change.");

            }
            this.ChangePasswordModel = {
              OldPassword: "", NewPassword: ""
            }
          }
        })
  }

  closeProfile() {
    this.router.navigateByUrl('/home');
  }

  get FirstName() {
    return this.authService.identityClaims
      ? this.authService.identityClaims['FirstName']
      : '-';
  }
  get LastName() {
    return this.authService.identityClaims
      ? this.authService.identityClaims['LastName']
      : '-';
  }
  get Phone() {
    return this.authService.identityClaims
      ? this.authService.identityClaims['Phone']
      : '-';
  }
  get Email() {
    return this.authService.identityClaims
      ? this.authService.identityClaims['Email']
      : '-';
  }
  get Company() {
    return this.authService.identityClaims
      ? this.authService.identityClaims['Company']
      : '-';
  }

  ManageProfile() {
    this.ShowProfileManage = false;
    this.ApplyJsFunction();
  }

  ChangePassword() {
    this.ShowProfileManage = true;
    this.ApplyJsFunction();
  }
}
