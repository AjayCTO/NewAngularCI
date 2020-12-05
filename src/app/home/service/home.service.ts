import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../../shared/config.service';
import { IApiResponse } from '../../../app/core/models/api-response';
import { BaseService } from "../../shared/base.service";
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class HomeService extends BaseService {

  constructor(private http: HttpClient, private configService: ConfigService) {

    super()
  }


  GetTenants(token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };
    return this.http.get<IApiResponse>(this.configService.resourceApiURI + '/api/Tenant/GetTenants', httpOptions).pipe(catchError(this.handleError));

  }
  GetAssignedTenants(token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };
    return this.http.get<IApiResponse>(this.configService.resourceApiURI + '/api/Tenant/GetAssignedTenants', httpOptions).pipe(catchError(this.handleError));

  }


  AddTenant(token: string, data: any) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };
    return this.http.post(this.configService.resourceApiURI + '/api/Tenant/InsertTenant', data, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }
}
