import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../shared/appState';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EventService } from '../../../dynamic-events/service/event.service';
import { LibraryService } from '../../../library/service/library.service';
import { SetSelectedTenant, SetSelectedTenantId } from '../../../store/actions/tenant.action';

@Component({
  selector: 'app-uom-modal',
  templateUrl: './uom-modal.component.html',
  styleUrls: ['./uom-modal.component.scss']
})
export class UomModalComponent implements OnInit {
  @ViewChild('AddUOMClose', { static: true }) AddUOMClose: ElementRef<HTMLElement>;
  @Output() RefreshUom = new EventEmitter();
  public selectedTenantId: number;
  constructor(private authService: AuthService, protected store: Store<AppState>, private formBuilder: FormBuilder, private toastr: ToastrService, private libraryService: LibraryService, private spinner: NgxSpinnerService,) { }
  public uomForm: FormGroup;
  ngOnInit(): void {
    debugger;
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    this.uomForm = this.formBuilder.group({
      uomName: ['', Validators.required],
    });
  }

  AddNewUOM() {
    if (this.uomForm.invalid) {
      return;
    }
    this.spinner.show();
    this.uomForm.value;
    this.libraryService.AddUom(this.selectedTenantId, this.uomForm.value, this.authService.accessToken)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {
          if (result) {
            debugger;

            if (result.entity == true) {
              this.toastr.success("Your Uom is Successfully Add.");
              let el: HTMLElement = this.AddUOMClose.nativeElement;
              el.click();
              this.RefreshUom.emit();

            }
            else {
              this.toastr.warning(result.message);
            }
          }
        });
  }
  closeUom(form) {
    form.reset();
  }
}
