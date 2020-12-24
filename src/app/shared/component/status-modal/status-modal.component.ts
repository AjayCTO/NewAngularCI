import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/auth.service';
import { LibraryService } from '../../../library/service/library.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../shared/appState';
import { SetSelectedTenant, SetSelectedTenantId } from '../../../store/actions/tenant.action';
@Component({
  selector: 'app-status-modal',
  templateUrl: './status-modal.component.html',
  styleUrls: ['./status-modal.component.scss']
})
export class StatusModalComponent implements OnInit {
  @ViewChild('AddStatusClose', { static: true }) AddStatusClose: ElementRef<HTMLElement>;
  @Output() RefreshStatus = new EventEmitter();
  public selectedTenantId: number;
  constructor(private authService: AuthService, protected store: Store<AppState>, private formBuilder: FormBuilder, private toastr: ToastrService, private libraryService: LibraryService, private spinner: NgxSpinnerService,) { }
  public statusForm: FormGroup;
  ngOnInit(): void {
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    this.statusForm = this.formBuilder.group({
      statusValue: ['', Validators.required],
    });
  }
  AddNewStatus() {
    if (this.statusForm.invalid) {
      return;
    }
    this.spinner.show();
    this.statusForm.value;
    this.libraryService.AddStatus(this.selectedTenantId, this.statusForm.value, this.authService.accessToken)
      .pipe(finalize(() => {
        this.spinner.hide();

      }))
      .subscribe(
        result => {
          if (result) {
            debugger;

            if (result.entity == true) {
              this.toastr.success("Your status is Successfully add.");
              let el: HTMLElement = this.AddStatusClose.nativeElement;
              el.click();
              this.RefreshStatus.emit();
            }
            else {
              this.toastr.warning(result.message);
            }
          }
        });
  }
  closeStatus(form) {
    form.reset();
  }
}
