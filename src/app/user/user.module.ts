import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list/user-list.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../core/auth-guard.service';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
@NgModule({
  declarations: [UserListComponent],
  imports: [
    CommonModule,
    FormsModule, AutocompleteLibModule, ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'user', component: UserListComponent, canActivate: [AuthGuard] }
    ]),
  ]
})
export class UserModule { }
