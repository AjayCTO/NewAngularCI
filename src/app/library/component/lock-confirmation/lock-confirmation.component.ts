import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { selectSelectedTenantId, selectSelectedTenant, getTenantConfiguration } from '../../../store/selectors/tenant.selectors';
import { TenantConfig } from 'src/app/store/models/tenant.model';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../shared/appState';

@Component({
  selector: 'app-lock-confirmation',
  templateUrl: './lock-confirmation.component.html',
  styleUrls: ['./lock-confirmation.component.scss']
})
export class LockConfirmationComponent implements OnInit {
  @Input() Data;
  @Output() lockLocation = new EventEmitter();
  @Output() lockItemLibrary = new EventEmitter();
  @Output() lockUOM = new EventEmitter();
  @Output() hideClose = new EventEmitter();
  public data
  public tenantConfiguration: TenantConfig;
  constructor(protected store: Store<AppState>) { }

  ngOnInit(): void {
    debugger
    this.data = this.Data
    this.store.pipe(select(getTenantConfiguration)).subscribe(config => {
      if (config) {
        debugger
        this.tenantConfiguration = config;
      }
    });
  }

  Confirm() {
    this.lockLocation.emit(true);
    this.lockItemLibrary.emit(true);
    this.lockUOM.emit(true);
    this.close();
  }

  close() {
    this.hideClose.emit(false);
  }
}
