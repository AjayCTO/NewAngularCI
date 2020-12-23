import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from './api.service';
import { CommanSharedService } from './service/comman-shared.service';
import { LocationModalComponent } from './component/location-modal/location-modal.component';
import { UomModalComponent } from './component/uom-modal/uom-modal.component';
import { StatusModalComponent } from './component/status-modal/status-modal.component';
import { CustomFieldModalComponent } from './component/custom-field-modal/custom-field-modal.component';
@NgModule({
  providers: [
    ApiService,
    CommanSharedService,
  ],
  imports: [FormsModule, ReactiveFormsModule],
  declarations: [LocationModalComponent, UomModalComponent, StatusModalComponent, CustomFieldModalComponent],
  exports: [LocationModalComponent, StatusModalComponent, UomModalComponent]
})
export class SharedModule { }
