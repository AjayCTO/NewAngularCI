import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-confirmation2',
  templateUrl: './delete-confirmation2.component.html',
  styleUrls: ['./delete-confirmation2.component.scss']
})
export class DeleteConfirmation2Component implements OnInit {

  @Output() deleteCustom = new EventEmitter();
  @Output() deleteCircumstance = new EventEmitter();
  @Output() deleteState = new EventEmitter();
  @Output() hideClose = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  Confirm() {
    this.deleteCustom.emit();
    this.deleteCircumstance.emit();
    this.deleteState.emit();
    this.close();
  }

  close() {
    this.hideClose.emit(false);
  }
}
