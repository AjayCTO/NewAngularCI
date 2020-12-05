import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RegisterComponent } from './component/register/register.component';
import { AccountService } from './service/account.service'
import { from } from 'rxjs';
import { NgxSpinnerModule } from "ngx-spinner";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ToastrModule } from 'ngx-toastr';
import { ProfileComponent } from './component/profile/profile.component';
import { AuthGuard } from '../core/auth-guard.service';




@NgModule({
  declarations: [RegisterComponent, ProfileComponent],
  imports: [
    CommonModule, NgxSpinnerModule, FormsModule, ReactiveFormsModule, ToastrModule.forRoot(),
    RouterModule.forChild([
      { path: 'register', component: RegisterComponent },
      { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] }
    ]),
  ],
  providers: [
    AccountService,
  ]
})
export class AccountModule { }
