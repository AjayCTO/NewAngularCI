import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss']
})
export class DeleteConfirmationComponent implements OnInit {

 
  @Output() deleteReport = new EventEmitter();
  @Output() hideClose = new EventEmitter();


  constructor() { }

  ngOnInit(): void { }

  Confirm() {
   
    this.deleteReport.emit();
    this.close();
  }

  close() {
    this.hideClose.emit(false);
  }
}
