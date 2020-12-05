import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import datePicker from '../../../../assets/js/lib/_datePicker';
import { TransactionTarget } from '../../models/admin.models';
@Component({
  selector: 'app-adjust-event',
  templateUrl: './adjust-event.component.html',
  styleUrls: ['./adjust-event.component.scss']
})
export class AdjustEventComponent implements OnInit {
  @Input() item: any;
  @Output() newItemEvent = new EventEmitter<any>();
  public AdjustQuantity: number;
  public today: Date;
  public selectedTenantId: number;
  constructor() {
    this.today = new Date();
  }
  TransactionTargetObj: TransactionTarget = {
    ToLocationId: 0,
    ToConvertedQuantity: 0,
    ToLocation: "",
    ToStatus: "",
    ToStatusId: 0,
    ToUom: "",
    ToUomId: null,
  }
  ngOnInit(): void {
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    this.ApplyJsFunction();
  }
  EventAction(item: any) {
    item.EventAction = 8;
    this.newItemEvent.emit(item);
  }

  ApplyJsFunction() {
    setTimeout(function () {
      inputClear();
      inputFocus();
      datePicker();
    }, 300)
  }

  AdjustQuantityFunc(data) {
    data.isAdjustOpen = false;
    let AdjustQty = this.AdjustQuantity - data.quantity;
    if (AdjustQty > 0) {
      data.transactionQty = AdjustQty;
      data.EventAction = 1;
      this.newItemEvent.emit(data);

    }
    else {
      AdjustQty = -1 * AdjustQty;
      data.transactionQty = AdjustQty;
      data.EventAction = 2;
      this.newItemEvent.emit(data);
    }
  }


}
