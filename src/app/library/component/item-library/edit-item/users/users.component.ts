import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../../user/service/user.service';
import { AuthService } from '../../../../../core/auth.service'
import { finalize } from 'rxjs/operators'
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
  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
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
