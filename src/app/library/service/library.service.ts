import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IApiResponse } from '../../core/models/api-response';
import { ConfigService } from '../../shared/config.service';
import { BaseService } from '../../shared/base.service';
@Injectable({
  providedIn: 'root'
})
export class LibraryService extends BaseService {

  constructor(private http: HttpClient, private configService: ConfigService) {
    super()
  }

  //Location Library service
  GetLocation(TenantId: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "bearer " + token
      })
    };
    return this.http.get<IApiResponse>(this.configService.resourceApiURI + '/api/Library/GetLocations?TenantId=' + TenantId, httpOptions).pipe(catchError(this.handleError));

  }

  AddLocation(TenantId: number, data: any, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "bearer " + token
      })
    };
    return this.http.post(this.configService.resourceApiURI + '/api/Library/InsertLocation?TenantId=' + TenantId, data, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));

  }


  upload(file: File, TenantId: number, token: string): Observable<HttpEvent<any>> {
    debugger;
    const
      formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.configService.resourceApiURI}/api/ManageUploads/UploadImages?TenantId=` + TenantId, formData, {
      reportProgress: true,
      responseType: 'json',
      headers: new HttpHeaders({
        'Authorization': "bearer " + token
      })

    });

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.configService.resourceApiURI}/files`);
  }



  EditLocation(TenantId: number, LocationId, data: any, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "bearer " + token
      })
    };
    return this.http.put(this.configService.resourceApiURI + '/api/Library/EditLocation?TenantId=' + TenantId + '&LocationId=' + LocationId, data, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));

  }

  Deletelocation(TenantId: number, id: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "bearer " + token
      })
    };
    return this.http.delete(this.configService.resourceApiURI + '/api/Library/DeleteLocation?TenantId=' + TenantId + '&Id=' + id, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }

  // Status

  GetStatus(TenantId: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "bearer " + token
      })
    };
    return this.http.get<IApiResponse>(this.configService.resourceApiURI + '/api/Library/getStatus?TenantId=' + TenantId, httpOptions).pipe(catchError(this.handleError));

  }
  AddStatus(TenantId: number, data: any, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "bearer " + token
      })
    };
    return this.http.post(this.configService.resourceApiURI + '/api/Library/InsertStatus?TenantId=' + TenantId, data, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }

  EditStatus(TenantId: number, StatusId, data: any, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "bearer " + token
      })
    };
    return this.http.put(this.configService.resourceApiURI + '/api/Library/EditStatus?TenantId=' + TenantId + '&StatusId=' + StatusId, data, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));

  }


  DeleteStatus(TenantId: number, id: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "bearer " + token
      })
    };
    return this.http.delete(this.configService.resourceApiURI + '/api/Library/DeleteStatus?TenantId=' + TenantId + '&Id=' + id, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }


  getAllPartWithPaging(TenantId: number, token: string, pageSize: number, pageRowIndex: number, sortColumn: string, sortOrder: string, searchText: string, data: any) {
    debugger;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };
    return this.http.post<IApiResponse>(this.configService.resourceApiURI + '/api/Library/GetAllPart?TenantId=' + TenantId + '&pageSize=' + pageSize + '&pageRowIndex=' + pageRowIndex + '&SortColumn=' + sortColumn + '&sortOrder=' + sortOrder + '&searchText=' + searchText, data, httpOptions).pipe(catchError(this.handleError));

  }
  // Unit of measure
  GetUOM(TenantId: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "bearer " + token
      })
    };
    return this.http.get<IApiResponse>(this.configService.resourceApiURI + '/api/Library/getUOM?TenantId=' + TenantId, httpOptions).pipe(catchError(this.handleError));

  }

  AddUom(TenantId: number, data: any, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "bearer " + token
      })
    };
    return this.http.post(this.configService.resourceApiURI + '/api/Library/InsertUOM?TenantId=' + TenantId, data, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));

  }

  EditUom(TenantId: number, UomId, data: any, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "bearer " + token
      })
    };
    return this.http.put(this.configService.resourceApiURI + '/api/Library/EditUOM?TenantId=' + TenantId + '&UOMId=' + UomId, data, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));

  }



  DeleteUOM(TenantId: number, id: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "bearer " + token
      })
    };
    return this.http.delete(this.configService.resourceApiURI + '/api/Library/DeleteUom?TenantId=' + TenantId + '&Id=' + id, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }

  // Part 
  // Unit of measure
  GetPart(TenantId: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "bearer " + token
      })
    };
    return this.http.get<IApiResponse>(this.configService.resourceApiURI + '/api/Library/getPart?TenantId=' + TenantId, httpOptions).pipe(catchError(this.handleError));

  }

  AddEditPart(TenantId: number, data: any, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "bearer " + token
      })
    };
    return this.http.post(this.configService.resourceApiURI + '/api/Library/InsertPart?TenantId=' + TenantId, data, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));

  }

  DeletePart(id: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "bearer " + token
      })
    };
    return this.http.delete(this.configService.resourceApiURI + '/api/Library/DeletePart?Id=' + id, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }


  //GetAllParts



}
