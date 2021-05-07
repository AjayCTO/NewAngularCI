import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IApiResponse } from '../../core/models/api-response';
import { ConfigService } from '../../shared/config.service';
import { BaseService } from '../../shared/base.service';
import { catchError, map } from 'rxjs/operators';
import { NumberValueAccessor } from '@angular/forms';

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
        'Authorization': "Bearer " + token,
        'X-TENANTID': TenantId.toString()
      })
    };
    return this.http.post(this.configService.resourceInventoryCoreApiURI + `/api/inventory/query`, data, httpOptions).pipe(catchError(this.handleError));

  }
  createUnitandIncreament(TenantId: number, token: string, data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token,
        'X-TENANTID': TenantId.toString()
      })
    };
    return this.http.post(this.configService.resourceInventoryCoreApiURI + `/api/transactions/create-unit-and-increment`, data, httpOptions).pipe(catchError(this.handleError));

  }
  Increment(TenantId: number, token: string, data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token,
        'X-TENANTID': TenantId.toString()
      })
    };
    return this.http.post(this.configService.resourceInventoryCoreApiURI + `/api/transactions/increment`, data, httpOptions).pipe(catchError(this.handleError));

  }
  Decrement(TenantId: number, token: string, data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token,
        'X-TENANTID': TenantId.toString()
      })
    };
    return this.http.post(this.configService.resourceInventoryCoreApiURI + `/api/transactions/decrement`, data, httpOptions).pipe(catchError(this.handleError));

  }
  GetUnitID(TransactionId: number, token: string,) {
    debugger;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "bearer " + token,
      })
    };
    return this.http.get<IApiResponse>(this.configService.resourceApiURI + `/api/transactions/${TransactionId}`, httpOptions).pipe(catchError(this.handleError));
  }
  Assign(TenantId: number, token: string, data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token,
        'X-TENANTID': TenantId.toString()
      })
    };
    return this.http.post(this.configService.resourceInventoryCoreApiURI + `/api/transactions/assign`, data, httpOptions).pipe(catchError(this.handleError));

  }

  CreateUnitandAssign(TenantId: number, token: string, data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token,
        'X-TENANTID': TenantId.toString()
      })
    };
    return this.http.post(this.configService.resourceInventoryCoreApiURI + `/api/transactions/create-unit-and-assign`, data, httpOptions).pipe(catchError(this.handleError));

  }
  QueryTransactionsHistoryAsync(TenantId: number, token: string, data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token,
        'X-TENANTID': TenantId.toString()
      })
    };
    return this.http.post(this.configService.resourceInventoryCoreApiURI + `/api/transactions/query`, data, httpOptions).pipe(catchError(this.handleError));

  }
  unitexactmatch(TenantId: number, token: string, filters) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token,
        'X-TENANTID': TenantId.toString()
      })
    };
    return this.http.post(this.configService.resourceInventoryCoreApiURI + `/api/units/exact-match`, filters, httpOptions).pipe(catchError(this.handleError));
  }


  FindOrCreateUnit(TenantId: number, token: string, request) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token,
        'X-TENANTID': TenantId.toString()
      })
    };
    return this.http.post(this.configService.resourceInventoryCoreApiURI + `/api/units/find-or-create`, request, httpOptions).pipe(catchError(this.handleError));
  }

  getInventoryCount(TenantId: number, token: string, filters) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token,
        'X-TENANTID': TenantId.toString()
      })
    };
    return this.http.post(this.configService.resourceInventoryCoreApiURI + `/api/inventory/count`, filters, httpOptions).pipe(catchError(this.handleError));

  }

  getTransactionCount(TenantId: number, token: string, filters) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token,
        'X-TENANTID': TenantId.toString()
      })
    };
    return this.http.post(this.configService.resourceInventoryCoreApiURI + `/api/transactions/count`, filters, httpOptions).pipe(catchError(this.handleError));

  }
}
