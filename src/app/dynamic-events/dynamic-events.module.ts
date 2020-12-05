import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventListComponent } from './component/event-list/event-list.component';
import { AuthGuard } from '../core/auth-guard.service';
import { RouterModule } from '@angular/router';
import { EventService } from './service/event.service';
import { AddEventComponent } from './component/add-event/add-event.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
@NgModule({
  declarations: [EventListComponent, AddEventComponent],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule, ColorPickerModule,
    RouterModule.forChild([
      { path: 'event', component: EventListComponent, canActivate: [AuthGuard] },
    ]),
  ],
  providers: [
    EventService
  ]

})
export class DynamicEventsModule { }
