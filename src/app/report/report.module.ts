import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventReportComponent } from './component/event-report/event-report.component';
import { InventoryReportComponent } from './component/inventory-report/inventory-report.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../core/auth-guard.service';
import { SharedModule } from '../shared/shared.module';
import { AddCustomReportComponent } from './component/add-custom-report/add-custom-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportService } from './service/report.service';
import { DeleteConfirmationComponent } from './component/delete-confirmation/delete-confirmation.component';
import { EditCustomReportComponent } from './component/edit-custom-report/edit-custom-report.component';
import { NgDragDropModule } from 'ng-drag-drop';
import { NgxPopperModule } from 'ngx-popper';
import { ColorPickerModule } from 'ngx-color-picker';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgxSortableModule } from 'ngx-sortable'
import { AddnewCustomReportComponent } from './component/addnew-custom-report/addnew-custom-report.component';
import { EditnewCustomReportComponent } from './component/editnew-custom-report/editnew-custom-report.component'
@NgModule({
  declarations: [EventReportComponent, InventoryReportComponent, AddCustomReportComponent, DeleteConfirmationComponent, EditCustomReportComponent, AddnewCustomReportComponent, EditnewCustomReportComponent],
  imports: [
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CommonModule,
    SharedModule,
    FormsModule,
    NgxPopperModule,
    ColorPickerModule,
    DragDropModule,
    AutocompleteLibModule,
    NgxSortableModule,
    NgDragDropModule.forRoot(),
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'report/event-report', component: EventReportComponent, canActivate: [AuthGuard] },
      { path: 'report/create-custom-report', component: AddCustomReportComponent, canActivate: [AuthGuard] },
      { path: 'report/edit-custom-report', component: EditCustomReportComponent, canActivate: [AuthGuard] },
      { path: 'report/editnew-custom-report', component: EditnewCustomReportComponent, canActivate: [AuthGuard] },
      { path: 'Dynamic/CreateEvent', component: InventoryReportComponent, canActivate: [AuthGuard] },
      { path: 'AddNewReport', component: AddnewCustomReportComponent, canActivate: [AuthGuard] },
    ]),
  ],
  providers:
    [ReportService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportModule { }
