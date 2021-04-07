import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
// import { UserManager, UserManagerSettings, User } from 'oidc-client';
import { BehaviorSubject } from 'rxjs';
import { IApiResponse } from '../../../app/core/models/api-response';
import { BaseService } from "../../shared/base.service";
import { ConfigService } from '../../shared/config.service';

@Injectable({
  providedIn: 'root'
})
export class EventService extends BaseService {

  constructor(private http: HttpClient, private configService: ConfigService) {
    super();
  }




  GetEvents(TenantId: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };
    return this.http.get<IApiResponse>(this.configService.resourceApiURI + '/api/UserManage/GetEvents?TenantId=' + TenantId, httpOptions).pipe(catchError(this.handleError));
  }
  AddEvent(TenantId: number, data: any, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "bearer " + token
      })
    };
    return this.http.post(this.configService.resourceApiURI + '/api/UserManage/InsertEvents?TenantId=' + TenantId, data, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));

  }
  DeleteEvent(id: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "bearer " + token
      })
    };
    return this.http.delete(this.configService.resourceApiURI + '/api/UserManage/DeleteEvents?Id=' + id, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }

  EditEvent(TenantId: number, Id, data: any, token: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "bearer " + token
      })
    };
    return this.http.put(this.configService.resourceApiURI + '/api/UserManage/EditEvents?TenantId=' + TenantId + '&Id=' + Id, data, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));

  }

}


