import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentInventoryGridComponent } from './component/current-inventory-grid/current-inventory-grid.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../core/auth-guard.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddEventComponent } from './component/add-event/add-event.component';
import { RemoveEventComponent } from './component/remove-event/remove-event.component';
import { MoveEventComponent } from './component/move-event/move-event.component';
import { ChangeEventComponent } from './component/change-event/change-event.component';
import { UpdateEventComponent } from './component/update-event/update-event.component';
import { ConvertEventComponent } from './component/convert-event/convert-event.component';
import { MoveAndChangeEventComponent } from './component/move-and-change-event/move-and-change-event.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { UploadActivityComponent } from './component/upload-activity/upload-activity.component';
import { ArrangeColumnComponent } from './component/arrange-column/arrange-column.component';
import { ProgressBarModule } from "angular-progress-bar";
import { AdjustEventComponent } from './component/adjust-event/adjust-event.component';
import { NgxPopperModule } from 'ngx-popper';
import { DynamicEventComponent } from './component/dynamic-event/dynamic-event.component';
import { StatementHistoryComponent } from './component/statement-history/statement-history.component';
import { EventListComponent } from './component/current-inventory-grid/event-list/event-list.component';
import { UploadComponent } from './component/upload(1)/upload.component'
import { NgImageSliderModule } from 'ng-image-slider';
import { InventoryReportComponent } from './component/reports/inventory-report/inventory-report.component';
import { CreatReportComponent } from './component/reports/inventory-report/creat-report/creat-report.component'

@NgModule({
  declarations: [CurrentInventoryGridComponent, UploadComponent, ArrangeColumnComponent,
    AddEventComponent, RemoveEventComponent, MoveEventComponent, ChangeEventComponent,
    UpdateEventComponent, ConvertEventComponent, MoveAndChangeEventComponent,
    UploadActivityComponent, AdjustEventComponent, DynamicEventComponent,
    StatementHistoryComponent, EventListComponent, InventoryReportComponent, CreatReportComponent],
  imports: [
    CommonModule, FormsModule, NgxPopperModule, ReactiveFormsModule, NgxSpinnerModule, AutocompleteLibModule, ProgressBarModule, NgImageSliderModule,
    RouterModule.forChild([
      { path: 'CurrentInventory', component: CurrentInventoryGridComponent, canActivate: [AuthGuard], runGuardsAndResolvers: "paramsChange" },
      { path: 'ArrangeColumn', component: ArrangeColumnComponent, canActivate: [AuthGuard] },
      { path: 'Reports', component: InventoryReportComponent, canActivate: [AuthGuard] }
    ]),

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CurrentinventoryModule { }
