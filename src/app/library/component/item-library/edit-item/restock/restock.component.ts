import { Component, Input, OnInit } from '@angular/core';
import inputFocus from '../../../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../../../assets/js/lib/_inputClear';
import dropdown from '../../../../../../assets/js/lib/_dropdown';
import { LibraryService } from '../../../../service/library.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../../../core/auth.service';
@Component({
  selector: 'app-restock',
  templateUrl: './restock.component.html',
  styleUrls: ['./restock.component.scss']
})
export class RestockComponent implements OnInit {
  @Input() item: any;
  @Input() locationsList: any;
  public location: any;
  public selectedItem
  public partId: number;
  error: string;
  public selectedTenantId: number;
  constructor(private libraryService: LibraryService, private toastr: ToastrService, private authService: AuthService) { }

  ngOnInit(): void {
    debugger;
    this.location = this.locationsList;
    this.selectedItem = this.item;
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    // this.ApplyJsFunction();
    setTimeout(function () {
      inputClear();
      inputFocus();

    }, 200)

  }
  edit() {
    debugger;

    this.partId = this.item.partId

    this.libraryService.EditPart(this.selectedTenantId, this.item.partId, this.selectedItem, this.authService.accessToken)
      .pipe(finalize(() => {

        // this.spinner.hide();
      }))
      .subscribe(
        result => {
          if (result) {

            if (result.entity == true) {
              this.toastr.success("Your Restock Is Successfully Update.");
              // this.GetLocation();

            }
            else {
              this.toastr.warning(result.message);
            }

          }
        },
        error => {
          debugger;
          this.error = error.error.message;
          // this.spinner.hide();
        });
  }

}
