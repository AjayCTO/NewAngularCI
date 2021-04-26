import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import inputFocus from '../../../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../../../assets/js/lib/_inputClear';
import dropdown from '../../../../../../assets/js/lib/_dropdown';
import { LibraryService } from '../../../../service/library.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../../../core/auth.service';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../../shared/appState';
import { selectSelectedTenantId, selectSelectedTenant, selectMyInventoryColumn, getTenantConfiguration } from '../../../../../store/selectors/tenant.selectors';

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
  constructor(private libraryService: LibraryService, private toastr: ToastrService, private authService: AuthService, protected store: Store<AppState>, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.location = this.locationsList;
    this.selectedItem = this.item;
    this.store.pipe(select(selectSelectedTenant)).
      subscribe(event => {
        if (event) {

          // this.selectedTenant = event;
          this.selectedTenantId = event.tenantId;
        }
        this.cdr.detectChanges();
      });
    // this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    // this.ApplyJsFunction();
    setTimeout(function () {
      inputClear();
      inputFocus();

    }, 200)

  }
  edit() {


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

          this.error = error.error.message;
          // this.spinner.hide();
        });
  }

}
