import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { selectSelectedTenantId, selectSelectedTenant } from '../../../store/selectors/tenant.selectors';
import { EventService } from '../../../dynamic-events/service/event.service';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/auth.service';
import * as XLSX from 'xlsx';
import { CurrentinventoryService } from '../../service/currentinventory.service'
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {


  @Output() hideClose = new EventEmitter();
  @Input() EventList: any;
  public uploadActivity: any;
  public exportdata: any;
  public selectedTenantId: number;
  // download as excel file
  fileName = 'ExcelSheet.xlsx';
  public busy: boolean;

  constructor(private authService: AuthService, private spinner: NgxSpinnerService, private currentinventoryService: CurrentinventoryService, private eventService: EventService) { }

  ngOnInit(): void {
    debugger;
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

          // this.EventList.forEach(element => {
          //   let obj = {}
          //   obj = JSON.parse(element.circumstanceJsonString);

          //   this.checklist.forEach(element12 => {
          //     element12.isSelected = obj[element12.columnName];
          //   });

          // });
        }
      })
  }
  DownloadTemplate() {
    this.currentinventoryService.downloadItemTemplate(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {
          debugger;
          this.exportdata = result
          this.exportexcel(this.exportdata)
        })
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
}
