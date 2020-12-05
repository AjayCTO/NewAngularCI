import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { LibraryService } from '../../../service/library.service';
import { AuthService } from '../../../../core/auth.service';
import { finalize } from 'rxjs/operators'
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import inputFocus from '../../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../../assets/js/lib/_inputClear';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss']
})
export class AddLocationComponent implements OnInit {

  locationForm: FormGroup;
  public selectedTenantId: number;
  @Output() hideClose = new EventEmitter();
  @Output() loadLocation = new EventEmitter();



  constructor(private formBuilder: FormBuilder, private libraryService: LibraryService, private toast: ToastrService, private cdr: ChangeDetectorRef, private spinner: NgxSpinnerService, private authService: AuthService) { }

  ngOnInit(): void {
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    this.locationForm = this.formBuilder.group({
      locationName: ['', Validators.required],
      description: ['', null],
      locationZone: ['', null],
    });
    inputClear();
    inputFocus();
  }

  onSubmit() {

    if (this.locationForm.invalid) {
      return;
    }
    this.spinner.show();
    this.locationForm.value;
    this.libraryService.AddLocation(this.selectedTenantId, this.locationForm.value, this.authService.accessToken)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {
          if (result) {
            debugger;

            if (result.entity == true) {
              this.toast.success("Your Location is Successfully add.");
              this.loadLocation.emit();

            }
            else {
              this.toast.warning(result.message);
            }



          }

        },
        error => {
          debugger;

          this.spinner.hide();
        });
  }




  close() {
    this.hideClose.emit(false);
  }

  onReset() {

  }

}
