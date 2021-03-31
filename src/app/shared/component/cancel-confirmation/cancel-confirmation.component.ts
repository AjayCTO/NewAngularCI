import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cancel-confirmation',
  templateUrl: './cancel-confirmation.component.html',
  styleUrls: ['./cancel-confirmation.component.scss']
})
export class CancelConfirmationComponent implements OnInit {
  @Output() hideClose = new EventEmitter();
  @Output() ClearCart = new EventEmitter();
  @Output() keepCart = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  clearCart() {
    this.ClearCart.emit()
    this.close();
  }
  KeepCart() {
    this.keepCart.emit()
    this.close()
  }
  close() {
    this.hideClose.emit(false);
  }
}
