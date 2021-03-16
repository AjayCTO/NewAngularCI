import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LocationLibraryComponent } from '../library/component/location-library/location-library.component';
import { UOMLibraryComponent } from '../library/component/uom-library/uom-library.component';
import { StatusLibraryComponent } from '../library/component/status-library/status-library.component';
import { ItemLibraryComponent } from '../library/component/item-library/item-library.component';
import { LibraryService } from './service/library.service';
import { NgxSpinnerModule } from "ngx-spinner";
import { AuthGuard } from '../core/auth-guard.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { AddLocationComponent } from './component/location-library/add-location/add-location.component';
import { AddStatusComponent } from './component/status-library/add-status/add-status.component';
import { AddUomComponent } from './component/uom-library/add-uom/add-uom.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { from } from 'rxjs';
import { NgxPopperModule } from 'ngx-popper';
import { DeleteConfirmationComponent } from './component/delete-confirmation/delete-confirmation.component';
import { UsersComponent } from './component/item-library/edit-item/users/users.component';
import { ValuesComponent } from './component/item-library/edit-item/values/values.component';
import { SettingsComponent } from './component/item-library/edit-item/settings/settings.component';
import { RestockComponent } from './component/item-library/edit-item/restock/restock.component';
import { DetailsComponent } from './component/item-library/edit-item/details/details.component';
import { EditItemComponent } from './component/item-library/edit-item/edit-item.component';
import { ImageLibraryComponent } from './component/image-library/image-library.component';
import { SharedModule } from '../shared/shared.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { UploadItemComponent } from './component/item-library/upload-item/upload-item.component'
@NgModule({
  declarations: [LocationLibraryComponent, UOMLibraryComponent, StatusLibraryComponent,
    UploadItemComponent, ItemLibraryComponent, AddLocationComponent, AddStatusComponent, AddUomComponent, DeleteConfirmationComponent, EditItemComponent, DetailsComponent, RestockComponent, UsersComponent, ValuesComponent, SettingsComponent, ImageLibraryComponent],
  imports: [
    CommonModule, OwlDateTimeModule, OwlNativeDateTimeModule,
    NgxSpinnerModule, FormsModule, NgxPopperModule, SharedModule, ReactiveFormsModule, AutocompleteLibModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger', // set defaults here
    }),
    RouterModule.forChild([
      { path: 'location', component: LocationLibraryComponent, canActivate: [AuthGuard] },
      { path: 'uom', component: UOMLibraryComponent, canActivate: [AuthGuard] },
      { path: 'status', component: StatusLibraryComponent, canActivate: [AuthGuard] },
      { path: 'item', component: ItemLibraryComponent, canActivate: [AuthGuard] },
      { path: 'EditItem', component: EditItemComponent, canActivate: [AuthGuard] },
      { path: 'ImageLibrary', component: ImageLibraryComponent, canActivate: [AuthGuard] }
    ]),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    LibraryService,
  ]
})
export class LibraryModule { }




