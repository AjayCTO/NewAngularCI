import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../../shared/config.service';
import { IApiResponse } from '../../../app/core/models/api-response';
import { BaseService } from "../../shared/base.service";
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  constructor(private http: HttpClient, private configService: ConfigService) {

    super()
  }

  RegisterMemberUser(token: string, data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };
    return this.http.post(this.configService.resourceApiURI + '/api/UserManage/RegisterMemberUser', data, httpOptions).pipe(map((response: {
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
        'Authorization': "Bearer " + token
      })
    };
    return this.http.get<IApiResponse>(this.configService.resourceApiURI + '/api/UserManage/GetMemberUser', httpOptions).pipe(catchError(this.handleError));
  }
  GetAllClaims(token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };
    return this.http.get<IApiResponse>(this.configService.resourceApiURI + '/api/UserManage/GetAllClaims', httpOptions).pipe(catchError(this.handleError));

  }

  RemoveTenantUser(TenantId: number, Id: string, token: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };
    return this.http.delete(this.configService.resourceApiURI + '/api/Tenant/RemoveAssocitedUsertoTenant?TenantId=' + TenantId + '&UserId=' + Id, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }
  UpdateMemberUserPermission(TenantId: number, data, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };
    return this.http.put(this.configService.resourceApiURI + '/api/Tenant/UpdateMemberUserPermission?TenantId=' + TenantId, data, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }

  GetUserWithTerm(term: string, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };
    return this.http.get<IApiResponse>(this.configService.resourceApiURI + '/api/UserManage/GetUserWithTerm?term=' + term, httpOptions).pipe(catchError(this.handleError));

  }

  GetMemberUserPermissionwithTenanId(UserId, TenantId: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };
    return this.http.get<IApiResponse>(this.configService.resourceApiURI + '/api/UserManage/GetMemberUserPermission?MemberUserId=' + UserId + '&TenantId=' + TenantId, httpOptions).pipe(catchError(this.handleError));

  }

  GetCurrentTenantUsers(TenantId: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };
    return this.http.get<IApiResponse>(this.configService.resourceApiURI + '/api/Tenant/GetTenantUsers?TenantId=' + TenantId, httpOptions).pipe(catchError(this.handleError));
  }
  AssociateWithTenant(TenantId: number, data, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };
    return this.http.post(this.configService.resourceApiURI + '/api/UserManage/AssociateUser?TenantId=' + TenantId, data, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }

}
