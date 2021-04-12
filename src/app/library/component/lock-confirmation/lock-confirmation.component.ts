import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-lock-confirmation',
  templateUrl: './lock-confirmation.component.html',
  styleUrls: ['./lock-confirmation.component.css']
})
export class LockConfirmationComponent implements OnInit {
  @Output() lockLocation = new EventEmitter();
  @Output() lockItemLibrary = new EventEmitter();
  @Output() lockUOM = new EventEmitter();
  @Output() hideClose = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
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
