import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../core/auth.service';
import { finalize } from 'rxjs/operators'
import { CommanSharedService } from '../../../shared/service/comman-shared.service'
import { from } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../shared/appState';
import { selectSelectedTenantId, selectSelectedTenant, selectMyInventoryColumn, getTenantConfiguration } from '../../../store/selectors/tenant.selectors';

@Component({
  selector: 'app-arrange-column',
  templateUrl: './arrange-column.component.html',
  styleUrls: ['./arrange-column.component.scss']
})
export class ArrangeColumnComponent implements OnInit {


  error: string;
  busy: boolean;

  MyInventoryFieldColumn: any[];
  myInventoryColumnSettings: any;
  selectedTenantId: number;

  constructor(private authService: AuthService, private spinner: NgxSpinnerService,
    private commanService: CommanSharedService, private router: Router, protected store: Store<AppState>, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.store.pipe(select(selectSelectedTenant)).
      subscribe(event => {
        if (event) {

          // this.selectedTenant = event;
          this.selectedTenantId = event.tenantId;
        }
        this.cdr.detectChanges();
      });
    // this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    this.spinner.show();
    this.GetMyInventoryColumns();
  }
  GetMyInventoryColumns() {

    this.commanService.GetMyInventoryColumns(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
        this.spinner.hide();
      })).subscribe(result => {

        if (result.entity != null) {
          this.MyInventoryFieldColumn = result.entity;
        }
      })
  }
  SaveMyInventoryColumn() {

    this.spinner.show();
    this.myInventoryColumnSettings = { MyInventoryColumnSettings: [] };
    this.myInventoryColumnSettings.MyInventoryColumnSettings = this.MyInventoryFieldColumn
    this.commanService.SaveMyInventoryColumns(this.myInventoryColumnSettings, this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {
          if (result) {
            this.router.navigate(['CurrentInventory']);
          }
        })

  }

}
