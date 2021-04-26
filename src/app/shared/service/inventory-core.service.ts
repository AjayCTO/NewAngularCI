import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IApiResponse } from '../../core/models/api-response';
import { ConfigService } from '../../shared/config.service';
import { BaseService } from '../../shared/base.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InventoryCoreService extends BaseService {

  constructor(private http: HttpClient, private configService: ConfigService) {
    super()
  }

  getCurrentInventory(TenantId: number, token: string, data) {
    debugger;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };
    return this.http.post(this.configService.resourceInventoryCoreApiURI + `/api/inventory/query/${TenantId}`, data, httpOptions).pipe(catchError(this.handleError));

  }
  createUnitandIncreament(TenantId: number, token: string, data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };
    return this.http.post(this.configService.resourceInventoryCoreApiURI + `/api/transactions/create-unit-and-increment/${TenantId}`, data, httpOptions).pipe(catchError(this.handleError));

  }
  Increment(TenantId: number, token: string, data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };
    return this.http.post(this.configService.resourceInventoryCoreApiURI + `/api/transactions/increment/${TenantId}`, data, httpOptions).pipe(catchError(this.handleError));

  }
  Decrement(TenantId: number, token: string, data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };
    return this.http.post(this.configService.resourceInventoryCoreApiURI + `/api/transactions/decrement/${TenantId}`, data, httpOptions).pipe(catchError(this.handleError));

  }
  GetUnitID(TransactionId: number, token: string,) {
    debugger;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "bearer " + token
      })
    };
    return this.http.get<IApiResponse>(this.configService.resourceApiURI + `/api/transactions/${TransactionId}`, httpOptions).pipe(catchError(this.handleError));
  }
  Assign(TransactionId: number, token: string, data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };
    return this.http.post(this.configService.resourceInventoryCoreApiURI + `/api/transactions/assign/${TransactionId}`, data, httpOptions).pipe(catchError(this.handleError));

  }
  Query(token: string, data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };
    return this.http.post(this.configService.resourceInventoryCoreApiURI + `/api/transactions/query`, data, httpOptions).pipe(catchError(this.handleError));

  }
  CreateUnitandAssign(token: string, data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };
    return this.http.post(this.configService.resourceInventoryCoreApiURI + `/api/transactions/create-unit-and-assign`, data, httpOptions).pipe(catchError(this.handleError));

  }

}
