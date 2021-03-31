import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { selectSelectedTenantId, selectSelectedTenant } from '../../../store/selectors/tenant.selectors';
import { EventService } from '../../../dynamic-events/service/event.service';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/auth.service';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { CurrentinventoryService } from '../../service/currentinventory.service'
import { NgxSpinnerService } from 'ngx-spinner';
import modal from '../../../../assets/js/lib/_modal';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  @ViewChild('UploadExcel') UploadExcel: ElementRef<HTMLElement>;
  @ViewChild('NextButton') NextButton: ElementRef<HTMLElement>;
  @Output() hideClose = new EventEmitter();
  @Output() RefreshInventory = new EventEmitter();
  @Input() EventList: any;
  public uploadActivity: any;
  public exportdata: any = [];
  public expotexcel: any;
  public CustomFields: any;
  public selectedEventConfig: any;
  public myInventoryField: any
  public ExcelSheetName: any;
  public fileUploaded: File;
  public allColumns: any = [];
  public showProgressBar: boolean;
  public obj: any = []
  public tabulatorColumn: any = [];
  public selectedTenantId: number;
  // download as excel file
  fileName = 'ExcelSheet.xlsx';
  public busy: boolean;

  constructor(private authService: AuthService, private spinner: NgxSpinnerService, private toastr: ToastrService, private currentinventoryService: CurrentinventoryService, private eventService: EventService) { }

  ngOnInit(): void {
    debugger;
    this.ExcelSheetName = ''
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    this.GetEvents();

  }
  Close() {
    this.hideClose.emit(false);
  }
  GetEvents() {
    debugger;
    this.eventService.GetEvents(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
        this.spinner.hide();
      })).subscribe(result => {
        if (result.entity != null) {
          debugger;
          this.EventList = result.entity;
          modal();


        }
      })
  }
  triggerFalseClick() {
    let el: HTMLElement = this.UploadExcel.nativeElement;
    el.click();
  }
  TotalCounter: any = [];
  TotalRecordsInExcel = 0;
  DownloadTemplate(event) {
    this.allColumns = [];
    this.allColumns.push({ 'Item Name': '' });
    this.allColumns.push({ 'Description': '' });
    this.allColumns.push({ 'Quanity': '' });
    this.allColumns.push({ 'UOM': '' });
    this.allColumns.push({ 'Location': '' });
    this.obj = JSON.parse(event.circumstanceJsonString)
    this.currentinventoryService.downloadItemTemplate(this.selectedTenantId, this.authService.accessToken).subscribe(data => {

      data.forEach(element => {
        if (element.customFieldType == "AttributeField") {
          this.allColumns.push({ [element.columnLabel]: '' });
        }
        else {


          if (this.obj[element.columnName])
            this.allColumns.push({ [element.columnLabel]: '' });
        }
      });

      this.exportexcel(this.allColumns);

    });
    // this.commanService.GetMyInventoryColumns(this.selectedTenantId, this.authService.accessToken).pipe(finalize(() => {
    //   this.busy = false;
    //   this.spinner.hide();
    // })).subscribe(result => {
    //   debugger;
    //   this.tabulatorColumn = []
    //   this.tabulatorColumn.push({ ItemName: "" });
    //   this.tabulatorColumn.push({ Description: "" });
    //   this.tabulatorColumn.push({ Qty: "" });
    //   this.tabulatorColumn.push({ Location: "" });
    //   this.tabulatorColumn.push({ UOM: "" });
    //   if (result.entity != null) {
    //     this.myInventoryField = result.entity;
    //     this.myInventoryField.forEach(element => {
    //       if (element.columnShow == true) {
    //         this.tabulatorColumn.push({ title: element.columnLabel });
    //       }
    //     });
    //   }
    //   this.GetCustomFields();

    // })
  }
  exportexcel(data): void {
    /* table id is passed over here */
    let element = data;
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(element);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }

  uploadedFile(event: any) {
    this.fileUploaded = event.target.files[0];
    //const bstr: string = this.fileUploaded;

    this.ExcelSheetName = this.fileUploaded.name
    var rABS = true;
    const jsonData = [];
    const reader: FileReader = new FileReader();
    debugger;
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
  GetCountOfRecords() {

  }
  btnUpload() {
    //this.spinner.show();
    debugger;
    const formData: FormData = new FormData();

    formData.append('file', this.fileUploaded, this.fileUploaded.name);
    this.showProgressBar = true;
    this.GetCountOfRecords();
    this.currentinventoryService.UploadexcelFile(this.selectedTenantId, formData, this.selectedEventConfig, this.authService.accessToken).subscribe(response => {
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
  RemoveexcelName() {
    debugger;
    this.ExcelSheetName = ''
  }

  selectedconfig(event) {
    this.selectedEventConfig = event;
    let el: HTMLElement = this.NextButton.nativeElement;
    el.click();

  }
  HideUploadActivity() {
    window.location.reload();
  }
}
