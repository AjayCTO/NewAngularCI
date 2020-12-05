import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators'
import { AuthService } from '../../../../core/auth.service';
import { LibraryService } from '../../../service/library.service';
import inputFocus from '../../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../../assets/js/lib/_inputClear';

@Component({
  selector: 'app-add-status',
  templateUrl: './add-status.component.html',
  styleUrls: ['./add-status.component.scss']
})
export class AddStatusComponent implements OnInit {



  public selectedTenantId: number;
  statusForm: FormGroup;
  @Output() hideClose = new EventEmitter();
  @Output() loadStatus = new EventEmitter();

  constructor(private formBuilder: FormBuilder, private authService: AuthService,
    private spinner: NgxSpinnerService, private toastr: ToastrService, private libraryService: LibraryService) { }

  ngOnInit(): void {

    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    this.statusForm = this.formBuilder.group({
      statusValue: ['', Validators.required],

    });
    this.AddJsFunction()
  }
  onSubmit() {
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
              this.loadStatus.emit();
            }
            else {
              this.toastr.warning(result.message);
            }
          }
        });
  }
  close() {
    this.hideClose.emit(false);
  }

  AddJsFunction() {
    setTimeout(function () {
      inputClear();
      inputFocus();
    }, 30)
  }
}
