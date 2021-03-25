import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-clear-confirmation',
  templateUrl: './clear-confirmation.component.html',
  styleUrls: ['./clear-confirmation.component.scss']
})
export class ClearConfirmationComponent implements OnInit {
  @Output() ClearConfirm = new EventEmitter();
  @Output() hideClose = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  Confirm() {

    this.ClearConfirm.emit();
    this.close();
  }
  close() {
    this.hideClose.emit(false);
  }
}
