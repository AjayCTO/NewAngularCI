import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttributeFieldsComponent } from './component/attribute-field/attribute-field.component';
import { RouterModule } from '@angular/router';
import { CustomFieldService } from './service/custom-field.service';
import { StatefieldComponent } from './component/statefield/statefield.component';
import { CircumstancefieldComponent } from './component/circumstancefield/circumstancefield.component'
import { AuthGuard } from '../core/auth-guard.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { DeleteConfirmation2Component } from './component/delete-confirmation2/delete-confirmation2.component';
import { CustomFieldsComponent } from './component/custom-fields/custom-fields.component';
// import { MessageModule } from 'ui-message-angular';
import { AddCustomComponent } from './component/custom-fields/add-custom/add-custom.component'

@NgModule({
  declarations: [AttributeFieldsComponent, StatefieldComponent, CustomFieldsComponent, CircumstancefieldComponent, DeleteConfirmation2Component, AddCustomComponent],
  imports: [
    CommonModule, NgxSpinnerModule,
    FormsModule,
    AutocompleteLibModule,
    // MessageModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger', // set defaults here
    }),
    RouterModule.forChild([
      { path: 'AttributeField', component: AttributeFieldsComponent, canActivate: [AuthGuard] },
      { path: 'StateField', component: StatefieldComponent, canActivate: [AuthGuard] },
      { path: 'CircumstanceField', component: CircumstancefieldComponent, canActivate: [AuthGuard] },
      { path: 'CustomField', component: CustomFieldsComponent, canActivate: [AuthGuard] },
    ]),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    CustomFieldService
  ]
})
export class CustomfieldModule { }


