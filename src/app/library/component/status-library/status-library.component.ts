import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators'
import { AuthService } from '../../../core/auth.service';
import { LibraryService } from '../../service/library.service';
import { Status } from '../../models/library-model';
import modal from '../../../../assets/js/lib/_modal';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-status-library',
  templateUrl: './status-library.component.html',
  styleUrls: ['./status-library.component.scss']
})
export class StatusLibraryComponent implements OnInit {

  Statuslist: any;
  public istableloaded = false;
  showForm1: boolean;
  error: string;
  busy: boolean;
  public selectedId: number;
  deleteStatus2 = false
  loadingRecords = false;
  public NotPermitted: boolean = false;
  public EditStatusMode: boolean;
  public showForm: boolean;
  status: Status = { statusId: 0, statusValue: '' }
  public selectedTenantId: number;
  statusForm: FormGroup;
  submitted = false;
  addStatus = false;
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex = 0;
  lastPageIndex = 0;

  constructor(private formBuilder: FormBuilder, private libraryService: LibraryService,
    private toastr: ToastrService, private authService: AuthService, private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {

    this.spinner.show();
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));



    this.EditStatusMode = false;
    this.showForm = false;
    this.GetStatus();
    modal();
    this.AddJsFunction();
  }
  get f() { return this.statusForm.controls; }

  onReset() {
    this.submitted = false;
    this.statusForm.reset();
  }
  GetStatus() {

    this.addStatus = false;
    this.istableloaded = false;
    this.loadingRecords = true;
    this.libraryService.GetStatus(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;

      })).subscribe(result => {
        if (result.code == 403) {
          this.NotPermitted = true;
        }
        else {
          if (result.entity != null) {
            this.loadingRecords = false;
            this.Statuslist = result.entity;
            this.length = result.entity.length;
          }
        }
        this.spinner.hide();
        this.Statuslist.forEach(element => {
          element.isActive = false;
        })

        this.istableloaded = true;
        this.cdr.markForCheck();
        modal();
      })
  }

  OpenMenu(item) {
    debugger
    this.Statuslist.forEach(element => {
      if (item.statusId != element.statusId)
        element.isActive = false;
    });
    item.isActive = !item.isActive;
    this.status = item;

    this.EditStatusMode = true;
    this.AddJsFunction();
  }
  CloseMenu(item) {
    item.isActive = false;
  }
  onSubmit() {

    if (this.EditStatusMode) {
      this.libraryService.EditStatus(this.selectedTenantId, this.status.statusId, this.status, this.authService.accessToken)
        .pipe(finalize(() => {

          this.spinner.hide();
        }))
        .subscribe(
          result => {
            if (result) {
              if (result.entity == true) {
                this.toastr.success("Your status is Successfully update.")
                this.GetStatus();
                this.status = { statusId: 0, statusValue: '' };
              }
              else {
                this.toastr.warning(result.message);
              }

            }
          },
          error => {
            this.error = error.error.message;
            this.spinner.hide();
          });
    }

  }

  deleteStatus() {
    this.spinner.show();
    this.libraryService.DeleteStatus(this.selectedTenantId, this.selectedId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {

          if (result.code == 403) {
            this.toastr.warning(result.message);
          }
          else {
            if (result) {
              this.toastr.success("Successfully Delete.")
              this.GetStatus();
            }
          }
        },
        error => {
          this.error = error;
          this.spinner.hide();
        });
  }

  OpenModal() {
    this.error = "";
    this.status = { statusId: 0, statusValue: '' };
    this.EditStatusMode = false;
    this.showForm = true;
    this.Statuslist.forEach(element => {
      element.isActive = false;
    });
    this.addStatus = true;
  }

  getValue(value: boolean) {
    this.addStatus = false;
  }

  AddJsFunction() {
    setTimeout(function () {
      inputClear();
      inputFocus();
    }, 30)
  }

  DeleteConfirm(item) {

    this.selectedId = item.statusId;
    this.deleteStatus2 = true;
  }
  deleteValue(value: boolean) {
    const html = document.querySelector('html');
    html.classList.remove('js-modal-page');
    this.deleteStatus2 = false;
  }
  gotoFirstPage() {
    this.pageIndex = 0;
    this.GetStatus();
  }
  gotoLastPage() {

    this.pageIndex = this.length / this.pageSize;
    this.pageIndex = parseInt(this.pageIndex.toString())
    this.GetStatus();
  }
  gotoNext() {

    this.lastPageIndex = this.length / this.pageSize;
    this.lastPageIndex = parseInt(this.lastPageIndex.toString())
    if (this.pageIndex != this.lastPageIndex) {
      this.pageIndex++;
      this.GetStatus();
    }
  }
  gotoBack() {
    if (this.pageIndex > 0) {
      this.pageIndex = this.pageIndex - 1;
      this.GetStatus();
    }
  }
}
