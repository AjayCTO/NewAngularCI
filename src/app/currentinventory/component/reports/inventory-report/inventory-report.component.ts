import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inventory-report',
  templateUrl: './inventory-report.component.html',
  styleUrls: ['./inventory-report.component.scss']
})
export class InventoryReportComponent implements OnInit {

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
