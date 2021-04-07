import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './core/auth.service';
import { Store } from '@ngrx/store';
import { Tenant } from './store/models/tenant.model';
import { AppState } from './store/models/app-state.model';
import { AddTenantAction } from './store/actions/tenant.action';
import { finalize } from 'rxjs/operators';
import { HomeService } from '../app/home/service/home.service';
@Component({
  selector: 'app-root',
  templateUrl: `./app.component.html`,
})
export class AppComponent implements OnInit {
  shoppingItems: Observable<Array<Tenant>>;
  isAuthenticated: Observable<boolean>;
  isDoneLoading: Observable<boolean>;
  currentTenantId$: Observable<number>;
  canActivateProtectedRoutes: Observable<boolean>;
  _haveTenantId$: Observable<boolean>;
  userInfo
  Tenants$: Observable<any>;
  busy
  constructor(private store: Store<AppState>,
    private authService: AuthService,
    private homeService: HomeService,
  ) {
    //this.shoppingItems = this.store.select(store => store.tenant);
    this.isAuthenticated = this.authService.isAuthenticated$;
    this.isDoneLoading = this.authService.isDoneLoading$;
    this.currentTenantId$ = authService.currentTenantId;
    this.canActivateProtectedRoutes = this.authService.canActivateProtectedRoutes$;
    this._haveTenantId$ = authService.haveTenantId;
    this.authService.runInitialLoginSequence();
    this.userInfo = authService.identityClaims;


  }
  ngOnInit() {



    if (this.isAuthenticated) {
      this.GetTenants();
    }
    // setTimeout(() => {
    //   this.addTenant();
    // }, 2000);
    // let loadAPI = new Promise(resolve => {
    //   console.log("resolving promise...");
    //   this.loadScript();
    // });
  }

  // addTenant() {
  //   this.store.dispatch(new AddTenantAction({ id: "0392sjdf9lkjd932j", name: "dashrath ji" }));
  // }
  login() {
    this.authService.login();
  }
  // url = "assets/js/NewJsForCI.js";

  GetTenants() {

    return new Promise(resolve => {
      setTimeout(() => {
        this.homeService.GetTenants(this.authService.accessToken)
          .pipe(finalize(() => {
            this.busy = false;
          })).subscribe(result => {
            this.Tenants$ = result.entity;
          })

      }, 2000);
    });


  }

  // loadScript() {
  //   console.log("preparing to load...");
  //   let node = document.createElement("script");
  //   node.src = this.url;
  //   // node.type = "text/javascript";
  //   // node.async = true;
  //   // node.charset = "utf-8";
  //   document.getElementsByTagName("head")[0].appendChild(node);
  // }
  logout() { this.authService.logout(); }
  refresh() { this.authService.refresh(); }
  reload() { window.location.reload(); }
  clearStorage() { localStorage.clear(); }

  logoutExternally() {
    window.open(this.authService.logoutUrl);
  }

  get hasValidToken() { return this.authService.hasValidToken(); }
  get accessToken() { return this.authService.accessToken; }
  get refreshToken() { return this.authService.refreshToken; }
  get identityClaims() { return this.authService.identityClaims; }
  get idToken() { return this.authService.idToken; }
}
