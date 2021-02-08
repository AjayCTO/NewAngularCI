import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentInventoryGridComponent } from './component/current-inventory-grid/current-inventory-grid.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../core/auth-guard.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { UploadActivityComponent } from './component/upload-activity/upload-activity.component';
import { ArrangeColumnComponent } from './component/arrange-column/arrange-column.component';
import { ProgressBarModule } from "angular-progress-bar";
import { NgxPopperModule } from 'ngx-popper';
import { DynamicEventComponent } from './component/dynamic-event/dynamic-event.component';
import { StatementHistoryComponent } from './component/statement-history/statement-history.component';
import { EventListComponent } from './component/current-inventory-grid/event-list/event-list.component';
import { UploadComponent } from './component/upload(1)/upload.component'
import { NgImageSliderModule } from 'ng-image-slider';
import { SharedModule } from '../shared/shared.module';
import { ReportComponent } from './component/report/report.component';
import { CreateReportComponent } from './component/report/create-report/create-report.component';
import { IteminventoryComponent } from './component/report/itemInventory/iteminventory/iteminventory.component';
import { CreateNewitemReportComponent } from './component/report/itemInventory/create-newitem-report/create-newitem-report.component';
import { FormioModule } from '@formio/angular';
@NgModule({
  declarations: [CurrentInventoryGridComponent, UploadComponent, ArrangeColumnComponent,
    UploadActivityComponent, DynamicEventComponent,
    StatementHistoryComponent, EventListComponent, ReportComponent, CreateReportComponent, IteminventoryComponent, CreateNewitemReportComponent],
  imports: [
    CommonModule, SharedModule, FormsModule, NgxPopperModule, ReactiveFormsModule, NgxSpinnerModule, AutocompleteLibModule, ProgressBarModule, NgImageSliderModule, FormioModule,
    RouterModule.forChild([
      { path: 'CurrentInventory', component: CurrentInventoryGridComponent, canActivate: [AuthGuard], runGuardsAndResolvers: "paramsChange" },
      { path: 'ArrangeColumn', component: ArrangeColumnComponent, canActivate: [AuthGuard] },
      { path: 'Reports', component: ReportComponent, canActivate: [AuthGuard] },
      { path: 'ItemReports', component: IteminventoryComponent, canActivate: [AuthGuard] },
      { path: 'crateReport', component: CreateReportComponent, canActivate: [AuthGuard] },
      { path: 'newitem', component: CreateNewitemReportComponent, canActivate: [AuthGuard] }
    ]),

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CurrentinventoryModule { }
