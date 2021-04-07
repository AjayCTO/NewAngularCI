import { Component, OnInit, ViewChild, ElementRef, } from '@angular/core';
import modal from '../../assets/js/lib/_modal';
// '../assets/js/lib/_modal';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @ViewChild('closeInventoryModal', { static: true }) closeInventoryModal: ElementRef<HTMLElement>;
  public array: any = []
  public EditItem: any = []
  public tableInfo = {
    label: "",
    link: "",
    NewWindow: false
  }
  public Config = {
    TimeZone: "",
    DeleteStatement: "",
    EmailWarning: "",
    Restock: false,
    Cost: false,
    defaultLocation: false,
    Quantity: false,
    LowQuantityThreshold: false,
    CreateItemName: false,
    ListKitting: false,
    allowResultInNegative: false,


  }
  public edit: boolean;
  constructor() { }


  ngOnInit(): void {
    this.edit = false
    modal();
  }

  Settings(name) {

    if (name == "Restock") {
      this.Config.Restock = !this.Config.Restock;
    }
    if (name == "Cost") {
      this.Config.Cost = !this.Config.Cost;
    }
    if (name == "defaultLocation") {
      this.Config.defaultLocation = !this.Config.defaultLocation;
    }
    if (name == "Quantity") {
      this.Config.Quantity = !this.Config.Quantity;
    }
    if (name == "LowQuantityThreshold") {
      this.Config.LowQuantityThreshold = !this.Config.LowQuantityThreshold;
    }
    if (name == "CreateItemName") {
      this.Config.CreateItemName = !this.Config.CreateItemName;
    }
    if (name == "ListKitting") {
      this.Config.ListKitting = !this.Config.ListKitting;
    }
    if (name == "allowResultInNegative") {
      this.Config.allowResultInNegative = !this.Config.allowResultInNegative;
    }
  }
  saveSettings() {

    this.Config;

  }

  savelinks() {

    this.array.push(this.tableInfo);

    this.tableInfo = {
      label: "",
      link: "",
      NewWindow: false
    }
    let el: HTMLElement = this.closeInventoryModal.nativeElement;
    el.click();
  }
  delete(Item) {
    this.array.splice(Item, 1);
  }
  Edit(index) {

    for (let i = 0; i < this.array.length; i++) {
      if (i == index) {
        this.EditItem = this.array[i]
      }
    }

    // this.edit = true;
    modal();

  }



}
