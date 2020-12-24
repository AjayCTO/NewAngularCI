import { Component, OnInit } from '@angular/core';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import toggle from '../../../../assets/js/lib/_toggle';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  creatReportOpen = false;
  public tabeldata: any = [{ 'Quantity': 20, 'UOM': 'piece', 'ItemName': 'Shirt', 'ItemDescription': 'this is shirt', 'Location': 'kankroli', 'Status': 'damaged' },
  { 'Quantity': 30, 'UOM': 'pieces', 'ItemName': 'T-Shirt', 'ItemDescription': 'this is Tshirt', 'Location': 'jodhpur', 'Status': 'damaged' }];
  public pageIndex: number;
  lastPageIndex = 0;
  pageSize = 10;
  length = 100;
  public tabulatorColumn1: any = [{ 'title': 'Quantity', 'datatype': 'number' }, { 'title': 'UOM', 'datatype': 'stringUom' }, { 'title': 'Item Name', 'datatype': 'string' }, { 'title': 'Item Description', 'datatype': 'string' }, { 'title': 'Location', 'datatype': 'string' }, { 'title': 'Status', 'datatype': 'stringStatus' },];
  public tabulatorValue: any;
  public ColumnDataType: string;
  constructor() { }

  ngOnInit(): void {
    debugger;
    // this.tabulatorColumn1 = JSON.parse(localStorage.getItem("tabelColumn"));
    // this.tabulatorValue = JSON.parse(localStorage.getItem("tabelValue"));
    inputFocus();
    this.onOptionsSelected('Quantity');
    toggle();
  }
  CreateReport() {
    this.creatReportOpen = true;
  }
  getValue(value: boolean) {
    const html = document.querySelector('html');
    html.classList.remove('js-modal-page');
    this.creatReportOpen = false;
  }
  gotoFirstPage() {
    this.pageIndex = 0;
    // this.GetCurrentInventory();
    // this.ApplyJsFunction();
  }
  gotoLastPage() {

    this.pageIndex = this.length / this.pageSize;
    this.pageIndex = parseInt(this.pageIndex.toString())
    // this.GetCurrentInventory();
    // this.ApplyJsFunction();
  }
  gotoNext() {
    debugger
    this.lastPageIndex = this.length / this.pageSize;
    this.lastPageIndex = parseInt(this.lastPageIndex.toString())
    if (this.pageIndex != this.lastPageIndex) {
      this.pageIndex++;
      // this.GetCurrentInventory();
      // this.ApplyJsFunction();
    }
  }
  gotoBack() {
    if (this.pageIndex > 0) {
      this.pageIndex = this.pageIndex - 1;
      // this.GetCurrentInventory();
      // this.ApplyJsFunction();
    }
  }
  onOptionsSelected(event) {
    debugger;
    this.tabulatorColumn1.forEach(element => {

      if (element.field == event) {

        this.ColumnDataType = element.datatype;
      }
    });

    setTimeout(function () {

      inputFocus();
    }, 500);

  }

}
