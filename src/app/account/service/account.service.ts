import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { ConfigService } from '../../shared/config.service';
import { BaseService } from "../../shared/base.service";
import { UserManager, UserManagerSettings, User } from 'oidc-client';
import { IApiResponse } from '../../../app/core/models/api-response';
import { Observable, of } from 'rxjs';
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

  uploadprofile(file: File, token: string): Observable<HttpEvent<any>> {

    const formData: FormData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('POST', `${this.configService.resourceApiURI}/api/UserManage/UploadProfile`, formData, {
      reportProgress: true,
      responseType: 'json',
      headers: new HttpHeaders({
        'Authorization': "bearer " + token
      })

    });

    return this.http.request(req);
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
