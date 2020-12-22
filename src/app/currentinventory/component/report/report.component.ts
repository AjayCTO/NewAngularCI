import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  creatReportOpen = false;
  constructor() { }

  ngOnInit(): void {
  }
  CreateReport() {
    this.creatReportOpen = true;
  }
  getValue(value: boolean) {
    const html = document.querySelector('html');
    html.classList.remove('js-modal-page');
    this.creatReportOpen = false;
  }
}
