import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../../../../user/service/user.service';
import { AuthService } from '../../../../../core/auth.service'
import { finalize } from 'rxjs/operators'
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../../shared/appState';
import { selectSelectedTenantId, selectSelectedTenant, selectMyInventoryColumn, getTenantConfiguration } from '../../../../../store/selectors/tenant.selectors';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  CurrentTenantUsers: any;
  public selectedTenantId: number;
  loadingRecords = false;
  AllMemberUser: any;
  busy: boolean;
  constructor(private authService: AuthService, private userService: UserService, protected store: Store<AppState>, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.store.pipe(select(selectSelectedTenant)).
      subscribe(event => {
        if (event) {

          // this.selectedTenant = event;
          this.selectedTenantId = event.tenantId;
        }
        this.cdr.detectChanges();
      });
    // this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    this.GetCurrentTenantUsers();
  }
  GetCurrentTenantUsers() {
    this.loadingRecords = true;
    this.userService.GetCurrentTenantUsers(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;

      })).subscribe(result => {

        if (result.entity != null) {
          this.loadingRecords = false;
          this.CurrentTenantUsers = result.entity;
          this.CurrentTenantUsers.sort(function (a, b) { return a.id - b.id; });
          this.GetMemberUser();
        }
      })
  }
  GetMemberUser() {
    this.loadingRecords = true;
    this.userService.GetMemberUser(this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;

      })).subscribe(result => {
        if (result.entity != null) {
          this.loadingRecords = false;
          this.AllMemberUser = result.entity;

        }
      })

  }
}
