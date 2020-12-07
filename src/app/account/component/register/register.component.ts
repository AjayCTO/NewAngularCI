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

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit, OnDestroy {


  isAuthenticated: Observable<boolean>;

  submitted = false;
  registerForm: FormGroup;
  success: boolean;
  error: string;
  userRegistration: UserRegistration = { firstName: '', lastName: '', company: '', phone: '', email: '', password: '' };


  constructor(private authService: AuthService, private spinner: NgxSpinnerService, private account: AccountService,
    private router: Router, private formBuilder: FormBuilder, private toastr: ToastrService,) {

    this.isAuthenticated = authService.isAuthenticated$;
  }
  ngOnDestroy() {
    document.body.classList.remove('stopscroll');
  }
  ngOnInit(): void {

    this.spinner.show();
    if (this.isAuthenticated)
      this.router.navigateByUrl('/home');
    document.body.classList.add('stopscroll');
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [null, Validators.compose([Validators.required, Validators.email, Validators.pattern(emailPattern)])],
      company: ['', Validators.required],
      phone: [null, Validators.required],
      password: [null, Validators.required],
    });

    this.spinner.hide();
    this.ApplyJsFunction();
  }

  ApplyJsFunction() {
    setTimeout(function () {
      inputFocus();
      inputClear();

    }, 1000)
  }

  get f() { return this.registerForm.controls; }

  login() {
    this.authService.login();
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
            }, 2000);

          }
        },
        error => {
          if (error) {
            this.toastr.warning(error);
          }
        });
  }
}
