import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { selectSelectedTenantId, selectSelectedTenant } from '../../../../store/selectors/tenant.selectors';
import { EventService } from '../../../../dynamic-events/service/event.service';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../../core/auth.service';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { CurrentinventoryService } from '../../../../currentinventory/service/currentinventory.service'
import { NgxSpinnerService } from 'ngx-spinner';
import modal from '../../../../../assets/js/lib/_modal';
@Component({
  selector: 'app-upload-item',
  templateUrl: './upload-item.component.html',
  styleUrls: ['./upload-item.component.scss']
})
export class UploadItemComponent implements OnInit {
  @ViewChild('UploadExcel') UploadExcel: ElementRef<HTMLElement>;
  @ViewChild('NextButton1') NextButton1: ElementRef<HTMLElement>;
  @Output() hideClose = new EventEmitter();
  @Output() RefreshInventory = new EventEmitter();
  @Input() EventList: any;
  public uploadActivity: any;
  public exportdata: any = [];
  public expotexcel: any;
  public CustomFields: any;
  public UploadActivityOpen: boolean
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

  constructor(private authService: AuthService, private spinner: NgxSpinnerService, private currentinventoryService: CurrentinventoryService, private toastr: ToastrService, private eventService: EventService) { }

  ngOnInit(): void {
    this.ExcelSheetName = ''
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    modal();
  }
  TotalCounter: any = [];
  TotalRecordsInExcel = 0;
  DownloadTemplate() {
    debugger;
    this.allColumns = [];
    this.allColumns.push({ 'Item Name': '' });
    this.allColumns.push({ 'Description': '' });
    this.allColumns.push({ 'Quanity': '' });
    this.allColumns.push({ 'UOM': '' });
    this.allColumns.push({ 'Location': '' });
    // this.obj = JSON.parse(event.circumstanceJsonString)
    // this.allColumns.push({ [this.obj.key]: '' })
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
  }
  triggerFalseClick() {
    let el: HTMLElement = this.UploadExcel.nativeElement;
    el.click();
  }
  DownloadLocationTemplate() {
    this.allColumns = [];
    this.allColumns.push({ 'Location': '' });
    this.allColumns.push({ 'Description': '' });
    this.allColumns.push({ 'Location Group': '' });


    this.exportexcel(this.allColumns);

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

  selectedconfig() {
    debugger;
    // this.selectedEventConfig = event;
    let el: HTMLElement = this.NextButton1.nativeElement;
    el.click();
    // modal();

  }
  HideUploadActivity() {
    // this.UploadActivityOpen = false;
    window.location.reload();
  }
}
