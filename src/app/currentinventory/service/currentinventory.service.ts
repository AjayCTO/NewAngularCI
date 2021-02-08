import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from "../../shared/base.service";
import { ConfigService } from '../../shared/config.service';
import { IApiResponse } from '../../../app/core/models/api-response';

@Injectable({
  providedIn: 'root'
})
export class CurrentinventoryService extends BaseService {

  constructor(private http: HttpClient, private configService: ConfigService) {
    super();
  }


  GetCurrentInventory(TenantId: number, token: string, pageToReturn: number, rowsPerPage: number, sortCol: string, sortDir: string, searchText: string, data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };

    return this.http.post<IApiResponse>(this.configService.resourceApiURI + '/api/CurrentInventory/GetAllInventories?TenantId=' + TenantId + '&pageToReturn=' + pageToReturn + '&rowsPerPage=' + rowsPerPage + '&sortCol=' + sortCol + '&sortDir=' + sortDir + '&searchText=' + searchText, data, httpOptions).pipe(catchError(this.handleError));

  }
  AddItemInventory(TenantId: number, token: string, Data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };
    return this.http.post(this.configService.resourceApiURI + '/api/CurrentInventory/InsertCurrentInventory?TenantId=' + TenantId, Data, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }
  AddDynamicEventInventory(TenantId: number, token: string, Data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };
    return this.http.post(this.configService.resourceApiURI + '/api/DynamicEvent/InsertDynamicEventInventory?TenantId=' + TenantId, Data, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }


  DynamicEventTransaction(TenantId: number, token: string, data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };
    return this.http.post(this.configService.resourceApiURI + '/api/DynamicEvent/DynamicInventoryTransaction?TenantId=' + TenantId, data, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));

  }
  InventoryTransaction(TenantId: number, token: string, data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };
    return this.http.post(this.configService.resourceApiURI + '/api/CurrentInventory/InventoryTransaction?TenantId=' + TenantId, data, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));

  }

  // downloadItemTemplate(TenantId: number, token: string) {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Authorization': "Bearer " + token,
  //       responseType: 'blob' as 'blob',

  //     })
  //   };
  //   return this.http.get(this.configService.resourceApiURI + '/api/ManageUploads/DownloadAddInventoryTemplate?TenantId=' + TenantId, httpOptions,
  //   ).pipe(map((response: any) => {
  //     
  //     window.open(response);
  //     return response;
  //   }));
  // }
  Download(TenantId: number, token: string, pageToReturn: number, rowsPerPage: number, sortCol: string, sortDir: string, searchText: string, data: any) {
    debugger;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };

    return this.http.post<IApiResponse>(this.configService.resourceApiURI + '/api/CurrentInventory/GetAllInventories?TenantId=' + TenantId + '&pageToReturn=' + pageToReturn + '&rowsPerPage=' + rowsPerPage + '&sortCol=' + sortCol + '&sortDir=' + sortDir + '&searchText=' + searchText, data, httpOptions).pipe(catchError(this.handleError));

  }
  downloadItemTemplate(TenantId: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Bearer " + token
      })
    };
    return this.http.get(this.configService.resourceApiURI + '/api/ManageUploads/DownloadAddInventoryTemplate?TenantId=' + TenantId, httpOptions,
    ).pipe(map((response: any) => {
      return response;
    }));
  }

  GetStatementHistory(TenantId: number, token: string, InventoryId: number) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Bearer " + token
      })
    };
    return this.http.get(this.configService.resourceApiURI + '/api/DynamicEvent/GetStatementHistory?TenantId=' + TenantId + '&InventoryId=' + InventoryId, httpOptions,
    ).pipe(map((response: any) => {
      return response;
    }));
  }

  UploadexcelFile(TenantId: number, file, config: any, token: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Bearer " + token,
      })
    };
    return this.http.post<IApiResponse>(this.configService.resourceApiURI + '/api/ManageUploads/ImportAddInventory?TenantId=' + TenantId + '&EventName=' + config.eventName + '&EventId=' + config.id + '&EventQuantityAction=' + config.eventQuantityAction + '&IslocationRequired=' + config.islocationRequired + '&IsUOMRequired=' + config.isUOMRequired, file, httpOptions).pipe(catchError(this.handleError));
  }

}
