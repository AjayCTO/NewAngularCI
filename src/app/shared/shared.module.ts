import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from './api.service';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../core/auth-guard.service';
import { CommanSharedService } from './service/comman-shared.service';
import { LocationModalComponent } from './component/location-modal/location-modal.component';
import { UomModalComponent } from './component/uom-modal/uom-modal.component';
import { StatusModalComponent } from './component/status-modal/status-modal.component';
import { CustomFieldModalComponent } from './component/custom-field-modal/custom-field-modal.component';
import { AttributeFieldModalComponent } from './component/attribute-field-modal/attribute-field-modal.component';
import { CustomFieldComponent } from './component/custom-field/custom-field.component';
import { TextComponent } from './component/custom-field/text/text.component';
import { NumberComponent } from './component/custom-field/number/number.component';
import { TimeComponent } from './component/custom-field/Date/time/time.component';
import { NgxPopperModule } from 'ngx-popper';
import { FalseComponent } from './component/custom-field/True/false/false.component';
@NgModule({
  providers: [
    ApiService,
    CommanSharedService,
  ],

  imports: [CommonModule, FormsModule, NgxPopperModule, ReactiveFormsModule, RouterModule.forChild([
    { path: 'sharedcustomfield', component: CustomFieldComponent, canActivate: [AuthGuard] },])],
  declarations: [LocationModalComponent, UomModalComponent, StatusModalComponent, CustomFieldModalComponent, AttributeFieldModalComponent, CustomFieldComponent, TextComponent, NumberComponent, TimeComponent, FalseComponent],
  exports: [LocationModalComponent, StatusModalComponent, UomModalComponent, CustomFieldModalComponent, AttributeFieldModalComponent],

})
export class SharedModule { }
