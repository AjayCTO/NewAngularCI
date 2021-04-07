import { Component, OnDestroy, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './core/auth.service';
import { Tenant } from './currentinventory/models/admin.models';
import { Store, select } from '@ngrx/store';
import { AppState } from '../app/shared/appState';
import { SetSelectedTenant, SetSelectedTenantId } from '../app/store/actions/tenant.action';
import { Router } from '@angular/router';
import { selectSelectedTenantId, selectSelectedTenant } from '../app/store/selectors/tenant.selectors';
@Component({
  selector: 'app-menu',
  templateUrl: `./app-menu.component.html`,
  styleUrls: ['./app-menu.component.scss']
})
export class AppMenuComponent {
  @Input() tenantList
  isAuthenticated: Observable<boolean>;
  currentTenantId$: Observable<number>;
  currentTenantName$: Observable<string>;
  _haveTenantId$: Observable<boolean>;
  _isTenantOwner$: Observable<boolean>;
  showProfileDD: boolean = false;
  showInventoryDD: boolean = false;
  selectedTenant: Tenant;
  showDropDown = false;
  constructor(private authService: AuthService, protected store: Store<AppState>, private router: Router,) {

    this.isAuthenticated = authService.isAuthenticated$;
    this._haveTenantId$ = authService.haveTenantId;
    this.currentTenantName$ = authService.curentTenantName;
    this.currentTenantId$ = authService.currentTenantId;
    this._isTenantOwner$ = authService.isTenantOwner;

    this.store.pipe(select(selectSelectedTenant)).
      subscribe(event => {
        if (event) {

          this.selectedTenant = event;

        }
      });
    // let TenantObj = localStorage.getItem('Tenant');
    // this.selectedTenant = JSON.parse(TenantObj);
  }

  login() {

    this.authService.login();
  }
  logout() {
    localStorage.removeItem('TenantId');
    localStorage.removeItem('Tenant');
    this.authService.logout();
  }

  SelectedTenant(value: any) {
    this.store.dispatch(new SetSelectedTenant(value));
    localStorage.setItem('TenantId', JSON.stringify(value.tenantId));
    localStorage.setItem('Tenant', JSON.stringify(value));
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(['CurrentInventory']);
    });
  }


  ProfileDropDown() {
    this.showProfileDD = !this.showProfileDD
  }
  toggleDropDown() {
    debugger
    this.showDropDown = !this.showDropDown;
    console.log('clicked');
  }
  closeDropDown() {
    debugger
    this.showDropDown = false;
  }
  InventoryDropDown() {
    this.showInventoryDD = !this.showInventoryDD
  }

  get email() {
    return this.authService.identityClaims
      ? this.authService.identityClaims['FirstName']
      : '-';
  }

  get photo() {
    return this.authService.identityClaims
      ? this.authService.identityClaims['Photo']
      : '-';
  }



}
