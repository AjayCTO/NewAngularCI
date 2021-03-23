import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cancel-confirmation',
  templateUrl: './cancel-confirmation.component.html',
  styleUrls: ['./cancel-confirmation.component.scss']
})
export class CancelConfirmationComponent implements OnInit {
  @Output() hideClose = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  close() {
    this.hideClose.emit(false);
  }
}
