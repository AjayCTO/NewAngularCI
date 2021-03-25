import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from "../../shared/base.service";
import { ConfigService } from '../../shared/config.service';
import { IApiResponse } from '../../../app/core/models/api-response';
import { NumberValueAccessor } from '@angular/forms';
import { data } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class CurrentinventoryService extends BaseService {

  constructor(private http: HttpClient, private configService: ConfigService) {
    super();
  }


  GetCurrentInventory(TenantId: number, token: string, pageToReturn: number, rowsPerPage: number, sortCol: string, sortDir: string, searchText: string, showSelected: boolean, data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };

    return this.http.post<IApiResponse>(this.configService.resourceApiURI + '/api/CurrentInventory/GetAllInventories?TenantId=' + TenantId + '&pageToReturn=' + pageToReturn + '&rowsPerPage=' + rowsPerPage + '&sortCol=' + sortCol + '&sortDir=' + sortDir + '&searchText=' + searchText + '&showSelected=' + showSelected, data, httpOptions).pipe(catchError(this.handleError));

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
  DynamicMultipleInventoryTransaction(TenantId: number, token: string, Data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };
    return this.http.post(this.configService.resourceApiURI + '/api/DynamicEvent/DynamicMultipleInventoryTransaction?TenantId=' + TenantId, Data, httpOptions).pipe(map((response: {
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


  CreateInventoryView(TenantId: number, token: string, data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Bearer " + token,
      })
    };
    return this.http.post(this.configService.resourceApiURI + '/api/CurrentInventory/InventoryView/Save?TenantId=' + TenantId, data, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }

  GetInventoryView(TenantId: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Bearer " + token
      })
    };
    return this.http.get(this.configService.resourceApiURI + '/api/CurrentInventory/InventoryViews/Get?TenantId=' + TenantId, httpOptions,
    ).pipe(map((response: any) => {
      return response;
    }));
  }

  DeleteInventoryView(TenantId: number, token: string, viewId: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "bearer " + token
      })
    };
    return this.http.delete(this.configService.resourceApiURI + '/api/CurrentInventory/InventoryView/Delete?TenantId=' + TenantId + '&ViewId=' + viewId, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }

  MakeasDefault(TenantId: number, token: string, viewId: number, data) {
    debugger;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "bearer " + token
      })
    };
    return this.http.put(this.configService.resourceApiURI + '/api/CurrentInventory/InventoryViews/MakeDefault?TenantId=' + TenantId + '&ViewId=' + viewId, data, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }

  EditInventoryView(TenantId: number, token: string, data: any, viewId: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Bearer " + token,
      })
    };
    return this.http.put(this.configService.resourceApiURI + '/api/CurrentInventory/InventoryView/Edit?TenantId=' + TenantId + '&ViewId=' + viewId, data, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }

  UndoTransaction(TenantId: number, token: string, transactionId: number, inventoryId: number, parentId: number) {
    debugger;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Bearer " + token,
      })
    };
    return this.http.get(this.configService.resourceApiURI + '/api/CurrentInventory/UndoTransaction?TenantId=' + TenantId + '&TransactionId=' + transactionId + '&InventoryId=' + inventoryId + '&ParentTransactionId=' + parentId, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }
  saveCart(TenantId: number, token: string, viewId: number, carts: any) {



    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Bearer " + token,
      })
    };
    return this.http.post(this.configService.resourceApiURI + '/api/CurrentInventory/InventoryCart/Save?TenantId=' + TenantId + '&ViewId=' + viewId, carts, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }
  getCartdetails(TenantId: number, token: string, viewId: number,) {
    debugger;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Bearer " + token,
      })
    };
    return this.http.get(this.configService.resourceApiURI + '/api/CurrentInventory/InventoryCart/Get?TenantId=' + TenantId + '&ViewId=' + viewId, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }

}
