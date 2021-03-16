import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../core/auth-guard.service';
import { HomeService } from './service/home.service';
import { TenantComponent } from './component/tenant/tenant.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxPopperModule } from 'ngx-popper';
@NgModule({
  declarations: [TenantComponent],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    FormsModule, ReactiveFormsModule,
    NgxPopperModule,
    RouterModule.forChild([

      { path: 'home', component: TenantComponent, canActivate: [AuthGuard] },

    ]),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    HomeService,
  ]
})
export class HomeModule { }
