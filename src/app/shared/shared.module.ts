import { NgModule, CUSTOM_ELEMENTS_SCHEMA, Injector } from '@angular/core';
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
import { FalseComponent } from './component/custom-field/True/false/false.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormioModule } from '@formio/angular';
// import { registerCustomComponent } from './component/custom-field/text/text.formio';
// import { EditEventsComponent } from '../shared/component/custom-field/edit-events/edit-events.component';
import { EditEventComponent } from './component/custom-field/edit-event/edit-event.component';
import { IconsComponent } from './component/icons/icons.component';
import { ConfigurationSummaryComponent } from './component/configuration-summary/configuration-summary.component';
import { NotPermitComponent } from './component/not-permit/not-permit.component';
@NgModule({
  providers: [
    ApiService,
    CommanSharedService,
  ],

  imports: [FormioModule, CommonModule, FormsModule, DragDropModule, ReactiveFormsModule, RouterModule.forChild([
    { path: 'sharedcustomfield', component: CustomFieldComponent, canActivate: [AuthGuard] },
    { path: 'sharedcustomfield12', component: FalseComponent, canActivate: [AuthGuard] },
    { path: 'eidtevents', component: EditEventComponent, canActivate: [AuthGuard] },
    { path: 'notPermited', component: NotPermitComponent, canActivate: [AuthGuard] },
    { path: 'configurationSummary', component: ConfigurationSummaryComponent, canActivate: [AuthGuard] }
  ])],

  declarations: [LocationModalComponent, UomModalComponent, StatusModalComponent, CustomFieldModalComponent, AttributeFieldModalComponent, CustomFieldComponent, FalseComponent, EditEventComponent, IconsComponent, ConfigurationSummaryComponent, NotPermitComponent],
  exports: [LocationModalComponent, StatusModalComponent, UomModalComponent, CustomFieldModalComponent, AttributeFieldModalComponent, IconsComponent],

})
export class SharedModule {
  constructor(injector: Injector) {
    // registerCustomComponent(injector);
  }
}
