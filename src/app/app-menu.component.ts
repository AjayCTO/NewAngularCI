import { Component, OnDestroy, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './core/auth.service';
import { Tenant } from './currentinventory/models/admin.models';
import { Store, select } from '@ngrx/store';
import { AppState } from '../app/shared/appState';
import { SetSelectedTenant, SetSelectedTenantId, SetTenantConfigurantion } from '../app/store/actions/tenant.action';
import { Router } from '@angular/router';
import { selectSelectedTenantId, selectSelectedTenant } from '../app/store/selectors/tenant.selectors';
import { CommanSharedService } from 'src/app/shared/service/comman-shared.service';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-menu',
  templateUrl: `./app-menu.component.html`,
  styleUrls: ['./app-menu.component.scss']
})
export class AppMenuComponent {
  public busy: boolean;
  @Input() tenantList
  public isAuthenticated: Observable<boolean>;
  public currentTenantId$: Observable<number>;
  public currentTenantName$: Observable<string>;
  public _haveTenantId$: Observable<boolean>;
  public _isTenantOwner$: Observable<boolean>;
  public showProfileDD: boolean = false;
  public showInventoryDD: boolean = false;
  public selectedTenant: Tenant;
  public showDropDown = false;
  public HelloMenuList: any[];
  constructor(private authService: AuthService, protected store: Store<AppState>, private router: Router, private commanService: CommanSharedService) {

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
    this.commanService.GetTenantConfiguration(value.tenantId, this.authService.accessToken).subscribe(res => {
      if (res.entity != null) {
        this.store.dispatch(new SetTenantConfigurantion(res.entity));
      }
      // this.router.navigate(['CurrentInventory']);   
      this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
        this.router.navigate(['CurrentInventory']);
      });
    });
  }
  gethelloMenu() {
    this.commanService.getHelloMenu(this.selectedTenant.tenantId, this.authService.accessToken).pipe(finalize(() => {
      this.busy = false;
    })).subscribe(result => {

      if (result.code == 200) {

        this.HelloMenuList = result.entity;
      }
    })
  }

  ProfileDropDown() {
    this.showProfileDD = !this.showProfileDD
    this.gethelloMenu();
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
