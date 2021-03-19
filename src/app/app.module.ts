import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ConfigService } from './shared/config.service';
import { AppMenuComponent } from './app-menu.component';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { FallbackComponent } from './fallback.component';
import { ShouldLoginComponent } from './should-login.component';
import { FooterComponent } from './footer/footer.component';
import { LibraryModule } from './library/library.module';
import { CustomfieldModule } from './customfield/customfield.module';
import { CurrentinventoryModule } from './currentinventory/currentinventory.module';
import { HomeModule } from './home/home.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
// import { Observable } from 'rxjs';
import 'flatpickr/dist/flatpickr.css';
import { FlatpickrModule } from 'angularx-flatpickr';
import { FormsModule } from '@angular/forms';
import { AccountModule } from './account/account.module';
import { TenantComponent } from './home/component/tenant/tenant.component';
import { RegisterComponent } from './account/component/register/register.component';
import { SharedModule } from './shared/shared.module';
import { TruncatePipe } from './shared/Pipe/truncate.pipe';
import { UserModule } from './user/user.module';
import { StoreModule } from '@ngrx/store';
import { eventsStoreReducers, metaReducers } from './store';
import { NgxPopperModule } from 'ngx-popper';
import { DynamicEventsModule } from './dynamic-events/dynamic-events.module';
import { ReportModule } from './report/report.module';
import { NgDragDropModule } from 'ng-drag-drop';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

// import { AddCustomFieldComponent } from './add-custom-field/add-custom-field.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { SettingsComponent } from './settings/settings.component'
import { AuthGuard } from './core/auth-guard.service';
import { QuickFieldCreatorComponent } from './quick-field-creator/quick-field-creator.component';
@NgModule({
  declarations: [
    AppComponent,
    AppMenuComponent,
    FallbackComponent,
    ShouldLoginComponent,
    SettingsComponent,
    FooterComponent,
    TruncatePipe,
    QuickFieldCreatorComponent,
    // AddCustomFieldComponent,
  ],
  imports: [
    OwlDateTimeModule, OwlNativeDateTimeModule,
    BrowserModule, NgxPopperModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    LibraryModule, ClickOutsideModule,
    HomeModule,
    NgxSpinnerModule,
    DynamicEventsModule,
    AccountModule,
    // Observable,

    CurrentinventoryModule,
    CustomfieldModule,
    CoreModule.forRoot(),
    FormsModule,
    SharedModule,
    UserModule,
    ReportModule,
    NgDragDropModule.forRoot(),
    StoreModule.forRoot({}, {}),
    StoreModule.forRoot(eventsStoreReducers, { metaReducers }),
    FlatpickrModule.forRoot(),
    StoreModule.forFeature('eventsStore', eventsStoreReducers),

    RouterModule.forRoot([
      { path: 'register', component: RegisterComponent },
      { path: '', redirectTo: '/register', pathMatch: 'full' },

      { path: 'configure', component: SettingsComponent, canActivate: [AuthGuard] },
      // Note: this way of module loading requires this in your tsconfig.json: "module": "esnext"
      // { path: 'basics', loadChildren: () => import('./feature-basics/basics.module').then(m => m.BasicsModule) },
      // { path: 'extras', loadChildren: () => import('./feature-extras/extras.module').then(m => m.ExtrasModule) },

      { path: 'should-login', component: ShouldLoginComponent },
      { path: 'QuickColumn', component: QuickFieldCreatorComponent, canActivate: [AuthGuard] },
      { path: 'auth-callback', component: FallbackComponent, },
      { path: '**', component: FallbackComponent, pathMatch: 'full' },
    ])
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    ConfigService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
