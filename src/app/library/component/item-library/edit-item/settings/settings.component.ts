import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import inputFocus from '../../../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../../../assets/js/lib/_inputClear';
import dropdown from '../../../../../../assets/js/lib/_dropdown';
import { LibraryService } from '../../../../service/library.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../../core/auth.service';
import { finalize } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../../shared/appState';
import { selectSelectedTenantId, selectSelectedTenant, selectMyInventoryColumn, getTenantConfiguration } from '../../../../../store/selectors/tenant.selectors';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @Input() locationsList: any;
  @Input() uomList: any;
  @Input() item: any;
  public selectedItem: any;
  public partId: number;
  public uomLists: any;
  public selectedTenantId: number;
  public locationsLists: any;
  tableinfo: FormGroup;
  error: string;
  showtable: boolean;
  public table: any = [];
  constructor(private libraryService: LibraryService, private formBuilder: FormBuilder, private toastr: ToastrService, private authService: AuthService, protected store: Store<AppState>, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.locationsLists = this.locationsList;
    this.selectedItem = this.item;
    this.showtable = false;
    this.store.pipe(select(selectSelectedTenant)).
      subscribe(event => {
        if (event) {

          // this.selectedTenant = event;
          this.selectedTenantId = event.tenantId;
        }
        this.cdr.detectChanges();
      });
    // this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    this.uomLists = this.uomList;
    this.tableinfo = this.formBuilder.group({
      HowManyQuantity: ['', null],
      Quantity: ['', null],
      DefaultUOM: ['', null],
    });


    setTimeout(function () {

      inputFocus();

    }, 200)
    // this.ApplyJsFunction();
  }
  showintable() {

    this.showtable = true;
    this.table = this.tableinfo.value;
  }
  edit() {

    this.partId = this.item.partId
    this.libraryService.EditPart(this.selectedTenantId, this.item.partId, this.selectedItem, this.authService.accessToken)
      .pipe(finalize(() => {
      }))
      .subscribe(
        result => {
          if (result) {

            if (result.entity == true) {
              this.toastr.success("Your Settings Is Successfully Update.");


            }
            else {
              this.toastr.warning(result.message);
            }

          }
        },
        error => {

          this.error = error.error.message;

        });
  }
  onUomSelected(event) {
    debugger
    this.selectedItem.uomName = event;
    this.uomLists.forEach(element => {
      if (element.uomName == event) {
        this.selectedItem.uomId = element.uomId;
      }
    });
  }
  onLocationSelected(event) {
    debugger
    this.selectedItem.locationName = event;
    this.locationsList.forEach(element => {
      if (element.locationName == event) {
        this.selectedItem.locationId = element.locationId;
      }
    });
  }

}
