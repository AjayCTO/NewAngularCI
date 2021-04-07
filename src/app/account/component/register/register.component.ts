import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { from } from 'rxjs';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators'
import { AuthService } from '../../../core/auth.service';
import { UserRegistration } from '../../models/account-model';
import { AccountService } from '../../service/account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import inputClear from '../../../../assets/js/lib/_inputClear';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import { Router, ActivatedRoute } from '@angular/router';
const emailPattern = '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,63}';
// const FirstName = '[a-zA-Z]{1,}';
// const LastName = '[a-zA-Z]{1,}';
const PhoneNumber = '^\+(?:[0-9]●?){6,14}[0-9]'
const Password = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$';
// const
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit, OnDestroy {
  isTextFieldType: boolean;
  public password;
  isAuthenticated: Observable<boolean>;
  show = false;
  submitted = false;
  registerForm: FormGroup;
  public showPassword: boolean
  public toggle: any;
  success: boolean;
  error: string;
  countrycode
  userRegistration: UserRegistration = { firstName: '', lastName: '', company: '', phone: '', email: '', password: '' };


  constructor(private authService: AuthService, private spinner: NgxSpinnerService, private account: AccountService,
    private router: Router, private formBuilder: FormBuilder, private toastr: ToastrService,) {

    this.isAuthenticated = authService.isAuthenticated$;
  }
  ngOnDestroy() {
    document.body.classList.remove('stopscroll');
  }
  ngOnInit(): void {
    this.toggleCountryCode = false;
    this.spinner.show();
    if (this.isAuthenticated)
      this.router.navigateByUrl('/home');
    document.body.classList.add('stopscroll');
    this.toggle = 'password';
    // this.password='password';
    this.registerForm = this.formBuilder.group({
      firstName: [null, Validators.compose([Validators.required,])],
      lastName: ['', Validators.compose([Validators.required,])],
      email: [null, Validators.compose([Validators.required, Validators.email])],
      company: ['', Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required, Validators.min(8)])],
      phone: [null, Validators.compose([Validators.required,])],

    });

    this.spinner.hide();
    this.ApplyJsFunction();
  }

  ApplyJsFunction() {
    setTimeout(function () {

      inputClear();
      inputFocus();

    }, 1000)
  }

  get f() { return this.registerForm.controls; }

  login() {

    this.authService.login();

  }
  selectedCountryCode = {
    country: "India", code: "+ 91"
  }
  toggleCountryCode: boolean = false;
  coutrywithCode = [
    { country: "Canada", code: "+ 1" },
    { country: "India", code: "+ 91" },
    { country: "United States", code: "+ 1" },
    { country: "Namibia", code: "+ 264" },

  ]


  SelectCountryCode(item) {
    this.selectedCountryCode.code = item.code;
    this.selectedCountryCode.country = item.country;
    this.toggleCountryCode = false;
  }
  onSubmit() {


    this.submitted = true;
    if (this.registerForm.invalid) {
      this.toastr.warning("Form is Invalid.")
      return;
    }
    this.spinner.show();
    this.userRegistration = this.registerForm.value;
    this.registerForm.markAllAsTouched();
    this.userRegistration.phone = this.selectedCountryCode.code + this.registerForm.value.phone;

    this.account.register(this.registerForm.value)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {
          if (result) {
            this.success = true;
            // this.spinner.show();
            // this.toastr.success("Your account have been Successfully create.and Redirect To login");
            setTimeout(() => {
              this.login();
            }, 3000);

          }
        },
        error => {
          if (error) {
            this.toastr.warning(error);
          }
        });
  }
  showPasswords() {
    this.showPassword = !this.showPassword;
    this.ApplyJsFunction();
  }
}
