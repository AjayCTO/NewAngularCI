import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './core/auth.service';
import { Tenant } from './currentinventory/models/admin.models';
@Component({
  selector: 'app-menu',
  templateUrl: `./app-menu.component.html`,
  styleUrls: ['./app-menu.component.scss']
})
export class AppMenuComponent {
  isAuthenticated: Observable<boolean>;
  currentTenantId$: Observable<number>;
  currentTenantName$: Observable<string>;
  _haveTenantId$: Observable<boolean>;
  _isTenantOwner$: Observable<boolean>;
  showProfileDD: boolean = false;
  showInventoryDD: boolean = false;
  selectedTenant: Tenant;
  constructor(private authService: AuthService) {

    this.isAuthenticated = authService.isAuthenticated$;
    this._haveTenantId$ = authService.haveTenantId;
    this.currentTenantName$ = authService.curentTenantName;
    this.currentTenantId$ = authService.currentTenantId;
    this._isTenantOwner$ = authService.isTenantOwner;
    let TenantObj = localStorage.getItem('Tenant');
    this.selectedTenant = JSON.parse(TenantObj);
  }

  login() {

    this.authService.login();
  }
  logout() {
    localStorage.removeItem('TenantId');
    localStorage.removeItem('Tenant');
    this.authService.logout();
  }

  ProfileDropDown() {
    this.showProfileDD = !this.showProfileDD
  }

  InventoryDropDown() {
    this.showInventoryDD = !this.showInventoryDD
  }

  get email() {
    return this.authService.identityClaims
      ? this.authService.identityClaims['FirstName']
      : '-';
  }




}
