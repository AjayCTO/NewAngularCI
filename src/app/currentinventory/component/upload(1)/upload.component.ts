import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {


  @Output() hideClose = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }
  Close() {
    this.hideClose.emit(false);
  }
}
