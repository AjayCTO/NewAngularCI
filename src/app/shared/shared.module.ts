import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from './api.service';
import { CommanSharedService } from './service/comman-shared.service';
import { LocationModalComponent } from './component/location-modal/location-modal.component';
import { UomModalComponent } from './component/uom-modal/uom-modal.component';
import { StatusModalComponent } from './component/status-modal/status-modal.component';
import { CustomFieldModalComponent } from './component/custom-field-modal/custom-field-modal.component';
import { AttributeFieldModalComponent } from './component/attribute-field-modal/attribute-field-modal.component';
@NgModule({
  providers: [
    ApiService,
    CommanSharedService,
  ],

  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [LocationModalComponent, UomModalComponent, StatusModalComponent, CustomFieldModalComponent, AttributeFieldModalComponent],
  exports: [LocationModalComponent, StatusModalComponent, UomModalComponent, CustomFieldModalComponent, AttributeFieldModalComponent],

})
export class SharedModule { }
