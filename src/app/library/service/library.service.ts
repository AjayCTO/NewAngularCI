import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IApiResponse } from '../../core/models/api-response';
import { ConfigService } from '../../shared/config.service';
import { BaseService } from '../../shared/base.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
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





  upload(files: File[], partId: number, TenantId: number, token: string) {

    const
      formData: FormData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i], files[i].name);

    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "bearer " + token
      })
    };

    return this.http.post(this.configService.resourceApiURI + '/api/ManageUploads/UploadImages?TenantId=' + TenantId + '&PartId=' + partId, formData, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));

    // formData.append('file', file);

    // const req = new HttpRequest('POST', `${this.configService.resourceApiURI}/api/ManageUploads/UploadImages?TenantId=` + TenantId, formData, {
    //   reportProgress: true,
    //   responseType: 'json',
    //   headers: new HttpHeaders({
    //     'Authorization': "bearer " + token
    //   })

    // });

    // return this.http.request(req);
  }

  // upload(file: File, TenantId: number, token: string): Observable<HttpEvent<any>> {
  //   
  //   const
  //     formData: FormData = new FormData();

  //   formData.append('file', file);

  //   const req = new HttpRequest('POST', `${this.configService.resourceApiURI}/api/ManageUploads/UploadImages?TenantId=` + TenantId, formData, {
  //     reportProgress: true,
  //     responseType: 'json',
  //     headers: new HttpHeaders({
  //       'Authorization': "bearer " + token
  //     })

  //   });

  //   return this.http.request(req);
  // }

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
  // Edit Part
  EditPart(TenantId: number, PartId, data: any, token: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "bearer " + token
      })
    };
    return this.http.put(this.configService.resourceApiURI + '/api/Library/EditPart?TenantId=' + TenantId + '&PartId=' + PartId, data, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));

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


  // get image

  GetTenantImages(TenantId: number, pageSize: number, pageIndex: number, search: string, token: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "bearer " + token
      })
    };
    return this.http.get<IApiResponse>(this.configService.resourceApiURI + '/api/Library/GetTenantImages?TenantId=' + TenantId + '&pageSize=' + pageSize + '&pageIndex=' + pageIndex + '&searchText=' + search, httpOptions)
      .pipe(catchError(this.handleError));

  }

  //allocateanddeallocateimages
  AllocateDeallocateImages(TenantId: number, PartId: number, ImageIds: any, isAssign: boolean, token: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "bearer " + token
      })
    };
    return this.http.post(this.configService.resourceApiURI + '/api/Library/AllocateDeallocateImages?TenantId=' + TenantId + '&PartId=' + PartId + '&isAllocate=' + isAssign, ImageIds, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }


  public exportAsExcelFile(json: any[], excelFileName: string,): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}
