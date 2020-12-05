import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IApiResponse } from '../../core/models/api-response';
import { ConfigService } from '../../shared/config.service';
import { BaseService } from '../../shared/base.service';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CommanSharedService extends BaseService {

  constructor(private http: HttpClient, private configService: ConfigService) {
    super()
  }

  GetMyInventoryColumns(TenantId: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };
    return this.http.get<IApiResponse>(this.configService.resourceApiURI + '/api/MyInventoryColumn/GetMyInventoryColumns?TenantId=' + TenantId, httpOptions).pipe(catchError(this.handleError));

  }
  GetItemWithTerm(term: string, TenantId: number, token: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };
    return this.http.get<IApiResponse>(this.configService.resourceApiURI + '/api/Library/GetPartwithSearch?TenantId=' + TenantId + '&term=' + term, httpOptions).pipe(catchError(this.handleError));

  }

  GetLocationWithTerm(term: string, TenantId: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };
    return this.http.get<IApiResponse>(this.configService.resourceApiURI + '/api/Library/GetLocationwithSearch?TenantId=' + TenantId + '&term=' + term, httpOptions).pipe(catchError(this.handleError));

  }

  SaveMyInventoryColumns(data: any, TenantId: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };
    return this.http.post(this.configService.resourceApiURI + '/api/MyInventoryColumn/SaveMyInventoryColumns?TenantId=' + TenantId, data, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }


}
