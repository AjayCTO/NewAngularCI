import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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
import { HttpEventType, HttpResponse } from '@angular/common/http';
const emailPattern = '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,63}';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('UploadProfile') UploadProfile: ElementRef<HTMLElement>;
  selectedFiles: FileList;
  progressInfos = [];
  message = '';
  busy: boolean;
  NonMembers: any;
  ProfileData: any;
  submitted = false;
  profileForm: FormGroup;
  public ShowProfileManage: boolean;
  Profile = {
    userName: '', firstName: '', lastName: '', company: '', phone: '', email: '', photo: ''
  }
  ChangePasswordModel = {
    OldPassword: '',
    NewPassword: ''
  }

  constructor(private authService: AuthService, private spinner: NgxSpinnerService, private router: Router, private accountService: AccountService,
    private formBuilder: FormBuilder, private toastr: ToastrService,) { }



  ngOnInit(): void {
    debugger;
    this.authService.getUserClaims();
    this.authService.setTenantIdNotHave();
    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      company: ['', Validators.required],
      phone: [null, Validators.required],
      photo: [null],
      email: [null, Validators.compose([Validators.required, Validators.email, Validators.pattern(emailPattern)])]
    });


    this.authService.getUserClaims();
    this.profileForm.controls['firstName'].setValue(this.FirstName);
    this.profileForm.controls['lastName'].setValue(this.LastName);
    this.profileForm.controls['company'].setValue(this.Company);
    this.profileForm.controls['phone'].setValue(this.Phone);
    this.profileForm.controls['email'].setValue(this.Email);
    this.profileForm.controls['photo'].setValue(this.Photo);
    this.ApplyJsFunction();
  }

  ApplyJsFunction() {
    setTimeout(function () {
      inputClear();
      inputFocus();
    }, 500)
  }
  get f() { return this.profileForm.controls; }

  triggerFalseClick() {
    let el: HTMLElement = this.UploadProfile.nativeElement;
    el.click();
  }
  UpdateProfileData() {
    this.authService.getUserClaims();
    this.profileForm.controls['firstName'].setValue(this.Profile.firstName);
    this.profileForm.controls['lastName'].setValue(this.Profile.lastName);
    this.profileForm.controls['company'].setValue(this.Profile.company);
    this.profileForm.controls['phone'].setValue(this.Profile.phone);
    this.profileForm.controls['email'].setValue(this.Email);
    this.profileForm.controls['photo'].setValue(this.Photo);
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
  get Photo() {
    return this.authService.identityClaims
      ? this.authService.identityClaims['Photo']
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

  selectFiles(event) {
    debugger;
    this.spinner.show();
    const files = event.target.files;
    let isImage = true;

    for (let i = 0; i < files.length; i++) {
      if (files.item(i).type.match('image.*')) {
        continue;
      } else {
        isImage = false;
        alert('invalid format!');
        break;
      }

    }
    this.selectedFiles = event.target.files;

    this.upload(0, this.selectedFiles[0]);

  }
  upload(idx, file) {
    this.progressInfos[idx] = { value: 0, fileName: file.name };

    this.accountService.uploadprofile(file, this.authService.accessToken).subscribe(
      event => {
        debugger;
        if (event.type === HttpEventType.UploadProgress) {
          this.progressInfos[idx].percentage = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.authService.getUserClaims();
          this.spinner.hide();
          this.toastr.success("Profile has been updated", "Profile");
          this.ApplyJsFunction();
        }


      },
      err => {
        this.spinner.hide();
        this.progressInfos[idx].percentage = 0;
        this.toastr.warning("Could not upload the file:" + file.name);
        // this.message = 'Could not upload the file:' + file.name;
      });
  }
}
