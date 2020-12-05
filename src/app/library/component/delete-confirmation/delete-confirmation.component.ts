import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss']
})
export class DeleteConfirmationComponent implements OnInit {

  @Output() deleteItem = new EventEmitter();
  @Output() deleteLocation = new EventEmitter();
  @Output() deleteStatus = new EventEmitter();
  @Output() deleteUOM = new EventEmitter();
  @Output() hideClose = new EventEmitter();


  constructor() { }

  ngOnInit(): void { }

  Confirm() {
    this.deleteItem.emit();
    this.deleteLocation.emit();
    this.deleteStatus.emit();
    this.deleteUOM.emit();
    this.close();
  }

  close() {
    this.hideClose.emit(false);
  }
}
