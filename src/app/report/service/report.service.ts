import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../../shared/config.service';
import { IApiResponse } from '../../../app/core/models/api-response';
import { BaseService } from "../../shared/base.service";
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseService {

  constructor(private http: HttpClient, private configService: ConfigService) {
    super()
  }



  AddCustomReport(TenantId: number, token: string, Data: any) {
    debugger;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };
    return this.http.post(this.configService.resourceApiURI + '/api/Report/CustomReportConfiguration/Save?TenantId=' + TenantId, Data, httpOptions).pipe(map((response: {
      message: string;
      code: number;
      entity: boolean;
    }) => {
      return response;
    }
    ));
  }

  GetCustomReportList(TenantId: number, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };
    return this.http.get<IApiResponse>(this.configService.resourceApiURI + '/api/Report/CustomReportConfiguration/Get?TenantId=' + TenantId, httpOptions).pipe(catchError(this.handleError));

  }

}
