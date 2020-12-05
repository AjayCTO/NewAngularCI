import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators'
import { AuthService } from '../../../../core/auth.service';
import { LibraryService } from '../../../service/library.service';
import inputFocus from '../../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../../assets/js/lib/_inputClear';

@Component({
  selector: 'app-add-uom',
  templateUrl: './add-uom.component.html',
  styleUrls: ['./add-uom.component.scss']
})
export class AddUomComponent implements OnInit {

  public selectedTenantId: number;
  uomForm: FormGroup;
  @Output() hideClose = new EventEmitter();
  @Output() loadUOM = new EventEmitter();

  constructor(private formBuilder: FormBuilder, private authService: AuthService,
    private spinner: NgxSpinnerService, private toastr: ToastrService, private libraryService: LibraryService) { }

  ngOnInit(): void {
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));

    this.uomForm = this.formBuilder.group({
      uomName: ['', Validators.required],

    });

    this.AddJsFunction()
  }

  onSubmit() {
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
              this.loadUOM.emit();
              document.getElementById("Closebtn").click();
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
