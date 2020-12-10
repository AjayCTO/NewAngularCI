import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { selectSelectedTenantId, selectSelectedTenant } from '../../../store/selectors/tenant.selectors';
import { EventService } from '../../../dynamic-events/service/event.service';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/auth.service';
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
  public selectedTenantId: number;
  public busy: boolean;

  constructor(private authService: AuthService, private spinner: NgxSpinnerService, private eventService: EventService) { }

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

}
