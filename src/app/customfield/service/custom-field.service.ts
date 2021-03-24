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
export class CustomFieldService extends BaseService {

  constructor(private http: HttpClient, private configService: ConfigService) {
    super();
  }


  GetTenantUsers(TenantId: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };
    return this.http.get<IApiResponse>(this.configService.resourceApiURI + '/api/Tenant/GetTenantUsers?TenantId=' + TenantId, httpOptions).pipe(catchError(this.handleError));
  }

  UpdateMemberUserPermission(TenantId: number, data, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
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


  RemoveTenantUser(TenantId: number, Id: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };
    return this.http.delete(this.configService.resourceApiURI + '/api/Tenant/RemoveAssocitedUsertoTenant?TenantId=' + TenantId + '&Id=' + Id, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }


  GetStateFields(TenantId: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };
    return this.http.get<IApiResponse>(this.configService.resourceApiURI + '/api/CustomFields/GetStateFields?TenantId=' + TenantId, httpOptions).pipe(catchError(this.handleError));
  }

  AddStateFields(data: any, TenantId: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };
    return this.http.post(this.configService.resourceApiURI + '/api/CustomFields/InsertState?TenantId=' + TenantId, data, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }

  GetAttributeFields(TenantId: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };
    return this.http.get<IApiResponse>(this.configService.resourceApiURI + '/api/CustomFields/GetAttributeFields?TenantId=' + TenantId, httpOptions).pipe(catchError(this.handleError));
  }

  GetCustomFields(TenantId: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };
    return this.http.get<IApiResponse>(this.configService.resourceApiURI + '/api/CustomFields/GetCustomFields?TenantId=' + TenantId, httpOptions).pipe(catchError(this.handleError));
  }

  GetAllFields(TenantId: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };
    return this.http.get<IApiResponse>(this.configService.resourceApiURI + '/api/CustomFields/GetAllFields?TenantId=' + TenantId, httpOptions).pipe(catchError(this.handleError));
  }

  AddCustomFields(data: any, TenantId: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };
    return this.http.post(this.configService.resourceApiURI + '/api/CustomFields/InsertCustomField?TenantId=' + TenantId, data, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }

  AddAttributeFields(data: any, TenantId: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };
    return this.http.post(this.configService.resourceApiURI + '/api/CustomFields/InsertAttribute?TenantId=' + TenantId, data, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }


  GetCurcumstanceFields(TenantId: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };
    return this.http.get<IApiResponse>(this.configService.resourceApiURI + '/api/CustomFields/GetCurcumstanceFields?TenantId=' + TenantId, httpOptions).pipe(catchError(this.handleError));
  }

  AddCircumstanceFields(data: any, TenantId: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };
    return this.http.post(this.configService.resourceApiURI + '/api/CustomFields/InsertCircumstance?TenantId=' + TenantId, data, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }

  InsertQuickColumn(data: any, TenantId: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };
    return this.http.post(this.configService.resourceApiURI + '/api/CustomFields/InsertQuickColumn?TenantId=' + TenantId, data, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }

  Deletecustomfield(id: number, tenantId, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };
    return this.http.delete(this.configService.resourceApiURI + '/api/CustomFields/DeleteCustomField?TenantId=' + tenantId + '&Id=' + id, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }

}



