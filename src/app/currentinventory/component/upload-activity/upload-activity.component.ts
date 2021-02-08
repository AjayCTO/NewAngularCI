import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../../core/auth.service';
import { CurrentinventoryService } from '../../service/currentinventory.service'
import modal from '../../../../assets/js/lib/_modal';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ConfigService } from '../../../shared/config.service';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { HubConnectionBuilder, HubConnection, LogLevel } from '@aspnet/signalr';
@Component({
  selector: 'app-upload-activity',
  templateUrl: './upload-activity.component.html',
  styleUrls: ['./upload-activity.component.scss']
})

export class UploadActivityComponent implements OnInit {
  public fileUploaded: File;
  public showProgressBar: boolean;
  selectedTenantId: number;
  @Output() RefreshInventory = new EventEmitter();
  ResultProgress = 0;
  constructor(private configService: ConfigService, private authService: AuthService, private toastr: ToastrService, private currentinventoryService: CurrentinventoryService, private spinner: NgxSpinnerService) {

    this.messages = [];
  }
  private _connection: HubConnection;
  public messages: string[];
  ngOnInit(): void {
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    modal();
    inputClear();
    inputFocus();
    this.ResultProgress = 0;
    this.messages = [];
    this._connection = new HubConnectionBuilder()
      .configureLogging(LogLevel.Debug)
      .withUrl(this.configService.resourceApiURI + "/progress")
      .build();

    this._connection.on("taskStarted", data => {
      this.messages = [];
    });
    this._connection.on("taskProgressChanged", data => {
      //this.ResultProgress = (parseInt(data) / this.TotalRecordsInExcel) * 100;
      console.log(data);

      this.messages.push(data);
      this.ResultProgress += 14;
    });
    this._connection.on("taskEnded", data => {

      //console.log(data);
    });

    this._connection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.error('Error while establishing connection: ' + err));
  }

  public downloadTemplate() {
    let allColumns = [];
    allColumns.push({ 'Item Name': '' });
    allColumns.push({ 'Description': '' });
    allColumns.push({ 'Quanity': '' });
    allColumns.push({ 'UOM': '' });
    allColumns.push({ 'Status': '' });
    allColumns.push({ 'Location': '' });
    this.currentinventoryService.downloadItemTemplate(this.selectedTenantId, this.authService.accessToken).subscribe(data => {

      data.forEach(element => {
        allColumns.push({ [element.columnName]: '' });
      });

      this.exportAsExcelFile(allColumns, "CreateAndAdd.xlsx");

    });




  }
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  downloadFile(data: any) {

    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }
  TotalCounter: any = [];
  TotalRecordsInExcel = 0;
  GetCountOfRecords() {

  }

  uploadedFile(event: any) {
    this.fileUploaded = event.target.files[0];
    //const bstr: string = this.fileUploaded;


    var rABS = true;
    const jsonData = [];
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const wb: XLSX.WorkBook = XLSX.read(e.target.result, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.TotalCounter = <any>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      this.TotalRecordsInExcel = this.TotalCounter.length;

    };
    reader.readAsBinaryString(event.target.files[0]);

  }

  btnUpload() {
    //this.spinner.show();
    const formData: FormData = new FormData();
    formData.append('file', this.fileUploaded, this.fileUploaded.name);
    this.showProgressBar = true;
    this.GetCountOfRecords();
    this.currentinventoryService.UploadexcelFile(this.selectedTenantId, this.toastr, formData, this.authService.accessToken).subscribe(response => {
      this.spinner.hide();
      if (response.code == 200) {


        this.toastr.success(response.message);

        document.getElementById("closeUploadModel").click();
        this.RefreshInventory.emit();

      }
      else {
        this.toastr.warning("something wrong");
      }

    });
  }
  Close() {
    this.showProgressBar = false;
  }

}
