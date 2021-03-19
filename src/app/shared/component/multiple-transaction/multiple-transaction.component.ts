import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { getSeletectEvent, selectSelectedTenant, getSelectedCart } from 'src/app/store/selectors/tenant.selectors';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../shared/appState';
import { finalize } from 'rxjs/operators';
import { CommanSharedService } from '../../service/comman-shared.service';
import { AuthService } from 'src/app/core/auth.service';
@Component({
  selector: 'app-multiple-transaction',
  templateUrl: './multiple-transaction.component.html',
  styleUrls: ['./multiple-transaction.component.scss']
})
export class MultipleTransactionComponent implements OnInit {

  public EventConfiguration: any
  public cartDetails: any;
  public selectedTenantId;
  public groupInventoryDetails: any;
  constructor(protected store: Store<AppState>, private commanService: CommanSharedService, private cdr: ChangeDetectorRef, private authService: AuthService) { }

  ngOnInit(): void {
    this.store.pipe(select(selectSelectedTenant)).
      subscribe(event => {
        if (event) {
          this.selectedTenantId = event.tenantId;
        }
        this.cdr.detectChanges();
      });
    this.store.pipe(select(getSeletectEvent)).
      subscribe(Eventconfiguration => {
        this.EventConfiguration = Eventconfiguration;
      });
    this.store.pipe(select(getSelectedCart)).
      subscribe(getSelectedCart => {
        this.cartDetails = getSelectedCart;
        this.GetCartInventory();
      });



  }


  public GetCartInventory() {
    debugger;
    this.commanService.getcartinventoryDetails(this.selectedTenantId, this.authService.accessToken, this.cartDetails).subscribe(res => {
      if (res) {

        this.groupInventoryDetails = res.entity.items;
        debugger;
      }
    })
  }


}
