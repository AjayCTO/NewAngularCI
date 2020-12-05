import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { ConfigService } from '../../shared/config.service';
import { BaseService } from "../../shared/base.service";
import { UserManager, UserManagerSettings, User } from 'oidc-client';
import { IApiResponse } from '../../../app/core/models/api-response';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends BaseService {


  private user: User | null;

  constructor(private http: HttpClient, private configService: ConfigService) {
    super();
  }

  GetUserDetails() {
    return this.user.profile;
  }


  register(userRegistration: any) {
    return this.http.post(this.configService.authApiURI + '/account', userRegistration).pipe(catchError(this.handleError));
  }

  ChangePassowrd(data: any, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };
    return this.http.put(this.configService.resourceApiURI + '/api/UserManage/ChangePassword', data, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }

  UpdateProfile(data: any, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };
    return this.http.put(this.configService.resourceApiURI + '/api/UserManage/UpdateProfile', data, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }
  GetMemberUser(token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };
    return this.http.get<IApiResponse>(this.configService.resourceApiURI + '/api/UserManage/GetMemberUser', httpOptions).pipe(catchError(this.handleError));
  }
}
