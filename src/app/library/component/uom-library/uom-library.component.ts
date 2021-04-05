import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { from } from 'rxjs';
import { LibraryService } from '../../service/library.service'
import { finalize } from 'rxjs/operators'
import { AuthService } from '../../../core/auth.service';
import { Uom } from '../../models/library-model';
import modal from '../../../../assets/js/lib/_modal';
import { ToastrService } from 'ngx-toastr';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, Routes } from '@angular/router';

@Component({
  selector: 'app-uom-library',
  templateUrl: './uom-library.component.html',
  styleUrls: ['./uom-library.component.scss']
})
export class UOMLibraryComponent implements OnInit {

  public selectedTenantId: number;
  public istableloaded = false;
  public EditUOMMode: boolean;
  public showForm: boolean;
  public selectedId: number;
  loadingRecords = false;
  UOMlist: any;
  excel = [];
  public NotPermitted: boolean = false;
  error: string;
  busy: boolean;
  uomForm: FormGroup;
  UOMs: Uom = { uomId: 0, uomName: '' }
  submitted = false;
  addUom = false;
  deleteUom = false;
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex = 0;
  lastPageIndex = 0;

  constructor(private formBuilder: FormBuilder, private router: Router, private spinner: NgxSpinnerService,
    private toast: ToastrService, private libraryService: LibraryService,
    private authService: AuthService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    // this.showForm = false;


    this.GetUOM();


    this.spinner.show();

    modal();
    this.AddJsFunction();
  }
  get f() { return this.uomForm.controls; }

  OpenMenu(item) {

    this.UOMs = { uomId: 0, uomName: '' };
    this.UOMlist.forEach(element => {
      if (item.uomId != element.uomId)
        element.isActive = false;
    });
    item.isActive = !item.isActive;
    this.UOMs = item;
    this.EditUOMMode = true;
    this.AddJsFunction();
  }

  CloseMenu(item) {
    item.isActive = false;
  }
  GetUOM() {

    this.addUom = false;
    this.istableloaded = false;
    this.loadingRecords = true;
    this.libraryService.GetUOM(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
        this.spinner.hide();
      })).subscribe(result => {

        if (result.code == 403) {
          this.router.navigateByUrl('/notPermited');
        }
        else {
          if (result.entity != null) {
            this.loadingRecords = false;
            this.UOMlist = result.entity;
            this.length = result.entity.length;
          }
        }
        this.UOMlist.forEach(element => {
          element.isActive = false;
        });

        this.istableloaded = true;
        this.cdr.markForCheck();
        modal();
      })
  }


  deleteUOM() {
    this.spinner.show();
    this.libraryService.DeleteUOM(this.selectedTenantId, this.selectedId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {

          if (result.code == 403) {
            this.toast.warning(result.message);
          }
          else {
            if (result) {
              this.toast.success("Successfully Delete.");
              this.GetUOM();
            }
          }

        },
        error => {
          this.error = error;
          this.spinner.hide();
        });
  }
  onSubmit() {

    if (this.EditUOMMode) {

      this.libraryService.EditUom(this.selectedTenantId, this.UOMs.uomId, this.UOMs, this.authService.accessToken)
        .pipe(finalize(() => {

          this.spinner.hide();
        }))
        .subscribe(
          result => {
            if (result) {
              if (result.entity == true) {
                this.toast.success("Your Uom Is Successfully Update.");
                this.GetUOM();
                this.UOMs = { uomId: 0, uomName: '' };
              }
              else {
                this.toast.warning(result.message);
              }

            }
          },
          error => {
            this.error = error.error.message;
            this.spinner.hide();
          });
    }

  }
  AddJsFunction() {
    setTimeout(function () {
      inputClear();
      inputFocus();
    }, 30)
  }
  OpenModal() {
    this.error = "";
    this.UOMs = { uomId: 0, uomName: '' };
    this.EditUOMMode = false;
    this.showForm = true;
    this.UOMlist.forEach(element => {
      element.isActive = false;
    });
    this.addUom = true;
  }
  getValue(value: boolean) {
    this.addUom = false;
  }


  DeleteConfirm(item) {

    this.selectedId = item.uomId;
    this.deleteUom = true;
  }
  deleteValue(value: boolean) {
    const html = document.querySelector('html');
    html.classList.remove('js-modal-page');
    this.deleteUom = false;
  }
  gotoFirstPage() {
    this.pageIndex = 0;
    this.GetUOM();
  }
  gotoLastPage() {

    this.pageIndex = this.length / this.pageSize;
    this.pageIndex = parseInt(this.pageIndex.toString())
    this.GetUOM();
  }
  gotoNext() {

    this.lastPageIndex = this.length / this.pageSize;
    this.lastPageIndex = parseInt(this.lastPageIndex.toString())
    if (this.pageIndex != this.lastPageIndex) {
      this.pageIndex++;
      this.GetUOM();
    }
  }
  gotoBack() {
    if (this.pageIndex > 0) {
      this.pageIndex = this.pageIndex - 1;
      this.GetUOM();
    }
  }

  exportAsXLSX(): void {
    let UomList = [];
    this.UOMlist.forEach(element => {
      UomList.push({ "Unit of Measure Name": element.uomName });
    });
    this.libraryService.exportAsExcelFile(UomList, "uom.xlsx");
  }

}
