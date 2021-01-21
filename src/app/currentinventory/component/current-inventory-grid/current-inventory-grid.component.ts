import { Component, OnInit, OnChanges, ViewEncapsulation, SimpleChanges, TemplateRef, Input, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { from, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/auth.service';
import { CurrentInventory, InventoryTransactionViewModel, TransactionTarget, ChangeStateFields, Tenant, DataColumnFilter } from '../../models/admin.models';
import { CustomFieldService } from '../../../customfield/service/custom-field.service'
import { LibraryService } from '../../../library/service/library.service';
import { CurrentinventoryService } from '../../service/currentinventory.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommanSharedService } from '../../../shared/service/comman-shared.service';
import { HomeService } from '../../../home/service/home.service';
import tables from '../../../../assets/js/lib/_tables';
import toggle from '../../../../assets/js/lib/_toggle';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import modal from '../../../../assets/js/lib/_modal';
import datePicker from '../../../../assets/js/lib/_datePicker';
import action from '../../../../assets/js/lib/_action';
import trigger from '../../../../assets/js/lib/_trigger';
import dropdown from '../../../../assets/js/lib/_dropdown';
import { Router } from '@angular/router';
import { each } from 'jquery';
import * as XLSX from 'xlsx';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../../dynamic-events/service/event.service';
import { CircumstanceFields, StateFields, AttributeFields, CustomFields } from '../../../customfield/models/customfieldmodel';
import { SetSelectedTenant, SetSelectedTenantId } from '../../../store/actions/tenant.action';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../shared/appState';
import { Item } from 'src/app/currentinventory/models/admin.models';
@Component({
  selector: 'app-current-inventory-grid',
  templateUrl: './current-inventory-grid.component.html',
  styleUrls: ['./current-inventory-grid.component.scss'],
})
export class CurrentInventoryGridComponent implements OnInit {
  @ViewChild('AddUOMClose', { static: true }) AddUOMClose: ElementRef<HTMLElement>;
  @ViewChild('AddCircumstanceClose', { static: true }) AddCircumstanceClose: ElementRef<HTMLElement>;
  @ViewChild('AddStatesClose', { static: true }) AddStatesClose: ElementRef<HTMLElement>;
  @ViewChild('AddAttributeClose', { static: true }) AddAttributeClose: ElementRef<HTMLElement>;
  @ViewChild('closeInventoryModal', { static: true }) closeInventoryModal: ElementRef<HTMLElement>;
  @ViewChild('AddCustomFieldClose', { static: true }) AddCustomFieldClose: ElementRef<HTMLElement>;
  @ViewChild('uploadActivity', { static: true }) uploadActivity: ElementRef<HTMLElement>;
  @ViewChild('UploadImage') UploadImage: ElementRef<HTMLElement>;

  @Input() item;
  public today: Date;
  public error: string;
  public busy: boolean;
  public a: any
  // download as excel file
  fileName = 'ExcelSheet.xlsx';
  public isSelectedCount: any;
  public CheckboxShow = false;
  public selectedTenantId: number;
  public myInventoryField: Observable<any>;
  public allInventoryItems: any;
  public AdjustQuantity: number;
  public addTenantForm: FormGroup;
  public IsActive: boolean;
  public selectedItem: any;
  public exportdata: any;
  public showForms: boolean = false;
  public ColumnDataType: string;
  public isSearchFilterActive: boolean = false;
  progressInfos = [];
  selectedFiles: File[] = [];
  listOfFiles: any[] = [];
  message = '';
  images = [];
  imageObject: any = [];
  myForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])

  });
  imgURL: any;
  // UOM MEASURE , LOCATION & STATUS OBJECT
  public selectedLocation;
  public selectedUOm;
  public uomList: any[];
  public locationsList: any[];
  public statusList: any;
  public selectedStatus: "";
  public showInventoryModel: boolean;
  public ChangeStateFields: ChangeStateFields[] = [];
  public previewItem: any = {};
  TenantObject: any = { tenantId: 0, name: "", tenantColor: "", accountId: 0, createdBy: "Self" }
  public ChangeStateField: ChangeStateFields = {
    columnName: "",
    columnValue: "",
  };

  public FilterArray: DataColumnFilter[] = [];
  public dataColumnFilter: DataColumnFilter = {
    columnName: "",
    displayName: "",
    filterOperator: "",
    searchValue: "",
    type: ""
  }
  public name: any;
  //Tabulator 
  public tab = document.createElement('div');
  public Inventorytable: any;
  public tabulatorColumn: any = [];
  public InventoryDataBind: any = [];
  public selectedTenant: Tenant;

  //CUSTOM FIELD OBJECT 
  public CustomFields: any;
  public AttributeFields: any;


  CartList: [];
  totalInventoryItems: any;
  keys: string[] = [];
  Value: String[] = [];

  //ITEM SEARCH AUTOCOMPLETE VARIABLE
  public isLoadingResult: boolean = false;
  public data: any;
  keyword = 'partName';
  Locationkeyword = 'locationName';
  public IsItemHave: boolean = false;
  Tenants: any;
  IsInventoryLoaded: boolean = false;
  searchFilterText: string;

  //ADD NEW ATTRIBUTE FIELD
  public datatype: any = ['OpenField', 'Dropdown', 'Autocomplete', 'Number', 'Currency', 'Date', 'Date & Time', 'Time', 'True/False']
  public selectedDatatype: string;
  public cfdcomboValuesString: string;

  //DYNAMIC EVENTS
  public EventList: any;
  public selectedDynamicEvent: any;

  //ADD NEW UOM AND STATUS AND LOCATION
  public uomForm: FormGroup;


  //Group Event Activity Checkbox
  public masterSelected: boolean;
  public checkedList: any;

  //State History
  StatementHistoryOpen = false;

  //Upload Activity
  UploadActivityOpen: boolean;

  //Loading
  public loadingRecords: boolean = false;

  constructor(private authService: AuthService, protected store: Store<AppState>, private formBuilder: FormBuilder, private eventService: EventService, private router: Router, private homeService: HomeService, private cdr: ChangeDetectorRef, private commanService: CommanSharedService, private customfieldservice: CustomFieldService, private toastr: ToastrService, private libraryService: LibraryService, private currentinventoryService: CurrentinventoryService, private spinner: NgxSpinnerService,) {

    this.today = new Date();
    this.AdjustQuantity = 1;
    this.InventoryTransactionObj = {
      partId: 0,
      tenantId: 0,
      uomId: 0,
      locationId: 0,
      costPerUnit: 0,
      partName: "",
      partDescription: "",
      quantity: 1,
      uomName: "",
      locationName: "",
      transactionQty: 1,
      transactionCostPerUnit: 0,
      transactionQtyChange: 0,
      avgCostPerUnit: 0,
      transactionActionId: 0,
      inventoryId: 0,
      statusValue: "",
      customFields: [],
      attributeFields: [],
      circumstanceFields: [],
      stateFields: [],
    }
    this.TransactionTargetObj = {
      ToLocationId: 0,
      ToConvertedQuantity: 1,
      ToLocation: "",
      ToStatus: "",
      ToStatusId: 0,
      ToUom: "",
      ToUomId: null,

    }
    this.masterSelected = false;
    this.InventoryDataBind = [
      { inventoryId: 0, isSelected: false }
    ];
  }

  CurrentInventoryObj: CurrentInventory = {
    partId: 0,
    partName: "",
    partDescription: "",
    quantity: 1,
    costPerUnit: 0,
    uomId: 0,
    uomName: "",
    inventoryId: 0,
    locationId: 0,
    locationName: "",
    statusValue: "",
    attributeFields: [],
    circumstanceFields: [],
    stateFields: [],
    customFields: [],
    eventConfiguartion: null,
  }
  InventoryTransactionObj: InventoryTransactionViewModel = {
    partId: 0,
    tenantId: 0,
    uomId: 0,
    locationId: 0,
    costPerUnit: 0,
    partName: "",
    partDescription: "",
    quantity: 1,
    uomName: "",
    locationName: "",
    transactionQty: 1,
    transactionCostPerUnit: 0,
    transactionQtyChange: 0,
    avgCostPerUnit: 0,
    transactionActionId: 0,
    inventoryId: 0,
    statusValue: "",
    attributeFields: [],
    circumstanceFields: [],
    stateFields: [],
    customFields: [],
  }

  TransactionTargetObj: TransactionTarget = {
    ToLocationId: 0,
    ToConvertedQuantity: 1,
    ToLocation: "",
    ToStatus: "",
    ToStatusId: 0,
    ToUom: "",
    ToUomId: null,
  }

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];


  ngOnInit() {
    debugger;


    this.uomForm = this.formBuilder.group({
      uomName: ['', Validators.required],
    });

    this.isSelectedCount = 0;
    this.searchFilterText = "";
    this.IsInventoryLoaded = false;
    this.IsActive = false;
    let TenantObj = localStorage.getItem('Tenant');
    this.selectedTenant = JSON.parse(TenantObj);
    this.spinner.show();
    this.a = this.item;
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    debugger;
    this.GetTenants();
    this.GetAttributeFields();
    this.GetCustomFields();
    // this.GetCurcumstanceFields();
    // this.GetStateFields();
    this.getLocationList();
    this.getUOMList();
    this.getStatus();
    this.GetEvents();
    this.GetMyInventoryColumn();

    modal();
    this.ApplyJsFunction();


  }



  length: number = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex = 0;

  // MatPaginator Output

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  GetTenants() {
    this.homeService.GetTenants(this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
        this.spinner.hide();
      })).subscribe(result => {

        this.Tenants = result.entity;
        setTimeout(function () {
          modal();
          toggle();
          inputClear();
          inputFocus();
        }, 2000);

      })
  }



  SelectedTenant(value: any) {
    this.store.dispatch(new SetSelectedTenant(value));
    localStorage.setItem('TenantId', JSON.stringify(value.tenantId));
    localStorage.setItem('Tenant', JSON.stringify(value));
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(['CurrentInventory']);
    });
  }




  SearchFilter() {
    debugger;

    if (this.searchFilterText != undefined && this.searchFilterText != "") {
      this.isSearchFilterActive = true;
      this.GetCurrentInventory();
      this.ApplyJsFunction();
    }
  }
  RemoveSearchFilter() {
    debugger;
    this.IsInventoryLoaded = false;
    this.isSearchFilterActive = false;
    this.searchFilterText = ""
    this.GetCurrentInventory();
    this.ApplyJsFunction();
  }
  lastPageIndex = 0;


  gotoFirstPage() {
    this.pageIndex = 0;
    this.GetCurrentInventory();
    this.ApplyJsFunction();
  }
  gotoLastPage() {

    this.pageIndex = this.length / this.pageSize;
    this.pageIndex = parseInt(this.pageIndex.toString())
    this.GetCurrentInventory();
    this.ApplyJsFunction();
  }
  gotoNext() {
    debugger
    this.lastPageIndex = this.length / this.pageSize;
    this.lastPageIndex = parseInt(this.lastPageIndex.toString())
    if (this.pageIndex != this.lastPageIndex) {
      this.pageIndex++;
      this.GetCurrentInventory();
      this.ApplyJsFunction();
    }
  }
  gotoBack() {
    if (this.pageIndex > 0) {
      this.pageIndex = this.pageIndex - 1;
      this.GetCurrentInventory();
      this.ApplyJsFunction();
    }
  }



  OpenMenu(item) {
    this.InventoryDataBind.forEach(element => {
      if (element.inventoryId != item.inventoryId)
        element.isActive = false;
      element.isMoveAndChangeOpen = false;
      element.isAddOpen = false;
      element.isRemoveOpen = false;
      element.isMoveOpen = false;
      element.isChangeOpen = false;
      element.isConvertOpen = false;
      element.isUpdateOpen = false;
      element.isAdjustOpen = false;
      element.isDynamicEventOpen = false;
      element.StatementHistoryOpen = false;
    });
    item.isActive = !item.isActive;
    this.cdr.detectChanges();
  }

  CloseMenu(item) {
    item.isMoveAndChangeOpen = false;
    item.isAddOpen = false;
    item.isActive = false;
    item.isMoveOpen = false;
    item.isRemoveOpen = false;
    item.isChangeOPen = false;
    item.isConvertOpen = false;
    item.isUpdateOpen = false;
    item.isAdjustOpen = false;
    item.isDynamicEventOpen = false;
    item.StatementHistoryOpen = false;
  }

  closeDynamicEvent(item) {
    item.isDynamicEventOpen = false;
  }

  OpenAddInventory() {

    this.showInventoryModel = true;
  }

  Close() {
    this.showInventoryModel = false;
  }


  onSubmitDymamicEvent() {
    debugger;
    if ($.trim(this.CurrentInventoryObj.partName) == "") {
      this.toastr.warning("Item Name Required");
      return false;
    }
    this.spinner.show();
    this.CurrentInventoryObj.attributeFields = this.AttributeFields;
    this.CurrentInventoryObj.customFields = this.CustomFields;
    this.CurrentInventoryObj.locationId = parseInt(this.selectedLocation);
    this.CurrentInventoryObj.uomId = parseInt(this.selectedUOm);
    this.CurrentInventoryObj.statusValue = this.selectedStatus;
    this.CurrentInventoryObj.eventConfiguartion = this.selectedDynamicEvent;
    this.currentinventoryService.AddDynamicEventInventory(this.selectedTenantId, this.authService.accessToken, this.CurrentInventoryObj)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {
          if (result) {

            this.toastr.success("Successfull Added Item", "Succes");
            this.CurrentInventoryObj = {
              partId: 0,
              partName: "",
              partDescription: "",
              quantity: 0,
              costPerUnit: 0,
              uomId: 0,
              uomName: "",
              inventoryId: 0,
              locationId: 0,
              locationName: "",
              statusValue: "",
              attributeFields: [],
              circumstanceFields: [],
              stateFields: [],
              customFields: [],
              eventConfiguartion: null
            }
            //alert("Added");
            document.getElementById("closeInventoryModal").click();



            this.GetCurrentInventory();
            this.ApplyJsFunction();
          }
        },
        error => {
          this.error = error;
          this.spinner.hide();
        });
  }
  Download() {
    debugger;
    let sortCol = "PartName";
    let sortDir = "asc";
    this.commanService.Download(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
      })).subscribe(result => {
        debugger;
        this.exportdata = result.entity
        this.downloadFile(this.exportdata)
        console.log(this.exportdata)
      }),

      error => console.log("Error downloading the file.")
  }
  downloadFile(data) {
    debugger;
    /* table id is passed over here */
    let element = data;
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }
  // download as excel sheet
  exportexcel(): void {
    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }

  onSubmit() {
    debugger;
    if ($.trim(this.CurrentInventoryObj.partName) == "") {
      this.toastr.warning("Item Name Required");
      return false;
    }
    this.spinner.show();
    this.CurrentInventoryObj.attributeFields = this.AttributeFields;
    this.CurrentInventoryObj.locationId = parseInt(this.selectedLocation);
    this.CurrentInventoryObj.uomId = parseInt(this.selectedUOm);
    this.CurrentInventoryObj.statusValue = this.selectedStatus;
    this.currentinventoryService.AddItemInventory(this.selectedTenantId, this.authService.accessToken, this.CurrentInventoryObj)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {
          if (result) {

            this.toastr.success("Successfull Added Item", "Succes");
            this.CurrentInventoryObj = {
              partId: 0,
              partName: "",
              partDescription: "",
              quantity: 0,
              costPerUnit: 0,
              uomId: 0,
              uomName: "",
              inventoryId: 0,
              locationId: 0,
              locationName: "",
              statusValue: "",
              attributeFields: [],
              circumstanceFields: [],
              stateFields: [],
              customFields: [],
              eventConfiguartion: null
            }
            //alert("Added");
            document.getElementById("closeInventoryModal").click();



            this.GetCurrentInventory();
            this.ApplyJsFunction();
          }
        },
        error => {
          this.error = error;
          this.spinner.hide();
        });
  }




  GetMyInventoryColumn() {
    this.commanService.GetMyInventoryColumns(this.selectedTenantId, this.authService.accessToken).pipe(finalize(() => {
      this.busy = false;
      this.spinner.hide();
    })).subscribe(result => {
      debugger;
      this.tabulatorColumn.push({ title: "Item Name", field: "partName", type: "", datatype: "string", width: "170" });
      this.tabulatorColumn.push({ title: "Description", field: "partDescription", type: "", datatype: "string", width: "450" });
      this.tabulatorColumn.push({ title: "Qty", field: "quantity", type: "", datatype: "number", width: "170" });
      this.tabulatorColumn.push({ title: "Location", field: "locationName", type: "", datatype: "string", width: "170" });
      this.tabulatorColumn.push({ title: "UOM", field: "uomName", type: "", datatype: "stringUom", width: "170" });
      this.tabulatorColumn.push({ title: "Status", field: "statusValue", datatype: "stringStatus", width: "170" });
      this.tabulatorColumn.push({ title: "Last Event", field: "lastAction", datatype: "string", width: "170" });
      if (result.entity != null) {
        this.myInventoryField = result.entity;
        this.myInventoryField.forEach(element => {
          if (element.columnShow == true) {
            this.tabulatorColumn.push({ title: element.columnLabel, field: element.columnName, type: element.customeFieldType, datatype: "string", width: "170" });
          }
        });
      }
      else {

      }
      localStorage.setItem('tabelColumn', JSON.stringify(this.tabulatorColumn));
      this.ApplyDropDown();
      this.GetCurrentInventory();
    })
  }


  ApplyDropDown() {
    setTimeout(function () {
      dropdown();
    }, 2000)
  }


  OpenDynamicEventModel(dynamicEvent) {
    debugger;
    this.selectedDynamicEvent = dynamicEvent;
    let obj = JSON.parse(dynamicEvent.circumstanceJsonString);
    this.CustomFields.forEach(element => {
      element.columnValue = "";
    });
    for (let j = 0; j < this.CustomFields.length; j++) {
      this.CustomFields[j].customFieldIncludeOnDynamicEvent = obj[this.CustomFields[j].columnName];
    }
    this.ApplyJsFunction();
  }

  DynamicEventAction(item, dynamicEvent) {
    debugger;

    this.selectedDynamicEvent = dynamicEvent;
    let obj = JSON.parse(dynamicEvent.circumstanceJsonString);

    this.InventoryTransactionObj = item;
    this.CustomFields.forEach(element => {
      element.columnValue = "";
    });

    for (let i = 0; i < item.customFields.length; i++) {
      for (let j = 0; j < this.CustomFields.length; j++) {
        if (item.customFields[i].columnName == this.CustomFields[j].columnName) {

          if (obj[this.CustomFields[j].columnName]) {
            this.CustomFields[j].columnValue = item.customFields[i].columnValue;
          }
        }
        this.CustomFields[j].customFieldIncludeOnDynamicEvent = obj[this.CustomFields[j].columnName];
      }
    }
    this.selectedItem = item;
    item.isDynamicEventOpen = !item.isDynamicEventOpen;

  }




  AddTenant() {
    this.homeService.AddTenant(this.authService.accessToken, this.TenantObject)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        result => {
          if (result) {
            if (result.code == 409) {
              this.toastr.warning(result.message);
            }
            if (result.code == 200) {
              this.toastr.success("Your tenant is Successfully add.");
              document.getElementById("CloseBtnTenant").click();


            }
            this.GetTenants();
            this.TenantObject = { tenantId: 0, name: "", tenantColor: "", accountId: 0, createdBy: "Self" };
          }
        },
        error => {
          this.error = error;
          this.spinner.hide();
        });
  }


  GetCurrentInventory() {
    this.loadingRecords = true;
    this.CheckboxShow = false;
    let sortCol = "PartName";
    let sortDir = "asc";

    this.currentinventoryService.GetCurrentInventory(this.selectedTenantId, this.authService.accessToken, this.pageIndex + 1, this.pageSize, sortCol, sortDir, this.searchFilterText, this.FilterArray)
      .pipe(finalize(() => {
      })).subscribe(result => {

        this.InventoryDataBind = [];
        this.allInventoryItems = [];
        this.allInventoryItems = result.entity.items;
        this.length = result.entity.totalItems;
        for (let i = 0; i < this.allInventoryItems.length; i++) {
          let map = new Map<string, any>();
          for (let j = 0; j < this.tabulatorColumn.length; j++) {
            let keys = Object.keys(this.allInventoryItems[i])
            for (let key = 0; key < keys.length; key++) {
              if (keys[key] == this.tabulatorColumn[j].field) {
                map.set(this.tabulatorColumn[j].field, this.allInventoryItems[i][keys[key]])
              }
              else {
                map.set(keys[key], this.allInventoryItems[i][keys[key]])
              }
            }
            for (let k = 0; k < this.allInventoryItems[i].allFields.length; k++) {
              if (this.allInventoryItems[i].allFields[k].columnName == this.tabulatorColumn[j].field) {
                map.set(this.tabulatorColumn[j].field, this.allInventoryItems[i].allFields[k].columnValue)
              }
            }
            map.set("isSelected", false);
          }
          let jsonObject = {};
          map.forEach((value, key) => {
            jsonObject[key] = value
          });
          this.InventoryDataBind.push(jsonObject);
        }

        this.loadingRecords = false;
        this.IsInventoryLoaded = true;
        this.CheckboxShow = true;
        this.ApplyJsFunction();

      });
  }


  getLocationList() {
    this.libraryService.GetLocation(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
        this.spinner.hide();
      })).subscribe(result => {
        this.locationsList = result.entity;
      })
  }
  getUOMList() {
    this.libraryService.GetUOM(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
        this.spinner.hide();
      })).subscribe(result => {
        this.uomList = result.entity;
      })
  }

  getStatus() {
    this.libraryService.GetStatus(this.selectedTenantId, this.authService.accessToken).pipe(finalize(() => {
      this.busy = false;
    })).subscribe(result => {

      this.statusList = result.entity;

    })
  }

  GetEvents() {
    debugger;
    this.eventService.GetEvents(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
        this.spinner.hide();
      })).subscribe(result => {
        debugger;
        if (result.entity != null) {
          debugger;
          this.EventList = result.entity;
        }

      })
  }

  RemoveFilter(data) {
    this.FilterArray.forEach((element, index) => {

      if (element.columnName == data.columnName) {
        this.FilterArray.splice(index, 1);
      }

    });
    this.IsInventoryLoaded = false;
    this.GetCurrentInventory();
    this.ApplyJsFunction();
  }

  ClearAllFilter() {
    this.FilterArray = [];
    this.searchFilterText = "";
    this.GetCurrentInventory();
    this.ApplyJsFunction();
  }

  onOptionsSelected(event) {
    // send selected value
    this.tabulatorColumn.forEach(element => {

      if (element.field == event) {

        this.ColumnDataType = element.datatype;
      }

    });

    setTimeout(function () {
      inputClear();
      inputFocus();
    }, 500);

  }

  onOptionsSelected2(event) {
    this.tabulatorColumn.forEach(element => {

      if (element.field == event) {

        this.ColumnDataType = element.datatype;
      }
    });

    setTimeout(function () {
      inputClear();
      inputFocus();
    }, 500);

  }

  ApplyFilter() {
    if (this.dataColumnFilter.columnName == "" || this.dataColumnFilter.filterOperator == "" || this.dataColumnFilter.searchValue == "") {
      return false;
    }

    this.FilterArray.forEach((element, index) => {

      if (element.columnName == this.dataColumnFilter.columnName) {
        return false;
        this.toastr.warning("This coloum name already in filter");

      }

    });
    this.tabulatorColumn.forEach(element => {
      if (element.field == this.dataColumnFilter.columnName) {
        this.dataColumnFilter.displayName = element.title;
        this.dataColumnFilter.type = element.type;
      }
    });
    this.FilterArray.push(this.dataColumnFilter);
    if (this.dataColumnFilter.type == "AttributeField" || this.dataColumnFilter.type == "StateField") {
      this.dataColumnFilter.columnName = "$." + this.dataColumnFilter.columnName;
    }
    this.dataColumnFilter = {
      columnName: "",
      displayName: "",
      filterOperator: "",
      searchValue: "",
      type: ""
    }
    document.getElementById("filterButton").click();
    this.GetCurrentInventory();
    this.ApplyJsFunction();
  }


  CloseFilter() {
    document.getElementById("filterButton").click();
  }

  ApplyFilter2(columnName) {
    this.dataColumnFilter.columnName = columnName;
    if (this.dataColumnFilter.columnName == "" || this.dataColumnFilter.filterOperator == "" || this.dataColumnFilter.searchValue == "") {
      return false;
    }

    this.FilterArray.forEach((element, index) => {

      if (element.columnName == this.dataColumnFilter.columnName) {

        this.toastr.warning("This coloum name already in filter");
        return false;
      }

    });
    this.tabulatorColumn.forEach(element => {
      if (element.field == this.dataColumnFilter.columnName) {
        this.dataColumnFilter.displayName = element.title;
        this.dataColumnFilter.type = element.type;
      }
    });
    this.FilterArray.push(this.dataColumnFilter);
    if (this.dataColumnFilter.type == "AttributeField" || this.dataColumnFilter.type == "StateField") {
      this.dataColumnFilter.columnName = "$." + this.dataColumnFilter.columnName;
    }
    this.dataColumnFilter = {
      columnName: "",
      displayName: "",
      filterOperator: "",
      searchValue: "",
      type: ""
    }
    document.getElementById("filterButton2_" + columnName).click();
    this.GetCurrentInventory();
    this.ApplyJsFunction();
  }

  CloseFilter2(Id) {
    document.getElementById("filterButton2_" + Id).click();
  }



  //Attribute FIELDS
  GetAttributeFields() {
    this.customfieldservice.GetAttributeFields(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
        this.spinner.hide();
      })).subscribe(result => {
        this.AttributeFields = [];
        if (result.code == 200) {
          this.AttributeFields = result.entity;
          this.ApplyJsFunction();
        }
      })
  }

  GetCustomFields() {
    debugger;
    this.customfieldservice.GetCustomFields(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
        this.spinner.hide();
      })).subscribe(result => {
        this.CustomFields = [];
        if (result.code == 200) {
          this.CustomFields = result.entity;
          this.ApplyJsFunction();
        }
      })
  }

  getServerResponse(event) {
    this.ItemAutocompleteChange();
    this.CurrentInventoryObj.partName = event;
    this.isLoadingResult = true;
    this.commanService.GetItemWithTerm(event, this.selectedTenantId, this.authService.accessToken,)
      .subscribe(response => {
        this.data = response.entity;
        this.isLoadingResult = false;
      });

  }

  getLocation(event) {
    this.isLoadingResult = true;
    this.TransactionTargetObj.ToLocation = event;
    this.commanService.GetLocationWithTerm(event, this.selectedTenantId, this.authService.accessToken,)
      .subscribe(response => {
        this.data = response.entity;
        this.isLoadingResult = false;
      });
    this.ApplyJsFunction();
  }

  GetFieldsBytype(allList, cfdFieldType) {
    let items = [];
    allList.forEach(element => {
      if (element.customFieldType == cfdFieldType) {
        items.push(element);
      }
    });
    return items;
  }

  ComboValueDropdown(Value) {
    let items = [];
    if (Value != null) {
      items = Value.split('\n')
    }
    return items;
  }

  ItemAutocompleteChange() {
    this.CurrentInventoryObj.partId = 0;
    this.IsItemHave = false;
  }


  searchCleared() {
    console.log('searchCleared');
    this.data = [];
  }
  addInventory() {
    this.showForms = true;
  }

  selectLocationEvent(item) {
    this.TransactionTargetObj.ToLocationId = item.locationId;
    this.TransactionTargetObj.ToLocation = item.locationName;
  }

  selectEvent(item) {
    let itemJsonobject: any[];
    itemJsonobject = JSON.parse(item.attributeFieldsJsonSettings);
    this.keys = Object.keys(itemJsonobject);
    this.Value = Object.values(itemJsonobject);
    this.CurrentInventoryObj.partId = item.partId;
    this.CurrentInventoryObj.partName = item.partName;
    this.CurrentInventoryObj.partDescription = item.partDescription;
    this.selectedUOm = item.uomId;
    this.selectedLocation = item.locationId;
    this.selectedStatus = item.statusValue;

    this.AttributeFields.forEach(item => {
      for (let i = 0; i < this.keys.length; i++) {
        if (this.keys[i] == item.columnName) {

          item.columnValue = this.Value[i];

        }
      }
    });

    setTimeout(function () {
      toggle();
      inputClear();
      inputFocus();
      datePicker();
    }, 200)
    this.IsItemHave = true;

  }


  RefreshCurrentInventory() {
    this.GetCurrentInventory();
    this.ApplyJsFunction();
  }

  ApplyJsFunction() {
    setTimeout(function () {
      toggle();
      inputClear();
      inputFocus();
      datePicker();
    }, 2000)
  }












  //add new circumtance
  // AddNewCircumstance() {
  //   this.spinner.show();
  //   debugger;
  //   if (this.curcumstanceFields.customFieldSpecialType == "Autocomplete" || this.curcumstanceFields.customFieldSpecialType == "Dropdown") {
  //     this.curcumstanceFields.comboBoxValue = this.cfdcomboValuesString;
  //   }
  //   if (this.selectedDatatype == "Autocomplete" || this.selectedDatatype == "Dropdown" || this.selectedDatatype == "OpenField") {
  //     this.curcumstanceFields.dataType = "Text";
  //   }
  //   if (this.selectedDatatype == "Number" || this.selectedDatatype == "Currency") {
  //     this.curcumstanceFields.dataType = "Number";
  //   }
  //   if (this.selectedDatatype == "Date" || this.selectedDatatype == "Date & Time" || this.selectedDatatype == "Time") {
  //     this.curcumstanceFields.dataType = "Date/Time";
  //   }
  //   if (this.selectedDatatype == "True/False") {
  //     this.curcumstanceFields.dataType = "True/False";
  //   }
  //   this.curcumstanceFields.customFieldSpecialType = this.selectedDatatype;
  //   this.curcumstanceFields.customFieldIncludeOnAdd = true;
  //   this.customfieldservice.AddCircumstanceFields(this.curcumstanceFields, this.selectedTenantId, this.authService.accessToken)
  //     .pipe(finalize(() => {
  //       this.spinner.hide();
  //     }))
  //     .subscribe(
  //       result => {
  //         if (result) {
  //           debugger;

  //           if (result.entity == true) {
  //             this.toastr.success("Your circumstancefield is Successfully Add.");
  //             let el: HTMLElement = this.AddCircumstanceClose.nativeElement;
  //             el.click();
  //             this.GetCurcumstanceFields();
  //             setTimeout(function () {
  //               inputClear();
  //               inputFocus();
  //               datePicker();
  //             }, 100)

  //           }
  //           else {
  //             this.toastr.warning(result.message);
  //           }
  //         }
  //       });
  // }

  //Checkbox Group activity
  checkUncheckAll() {
    debugger;
    for (var i = 0; i < this.InventoryDataBind.length; i++) {
      this.InventoryDataBind[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }
  isAllSelected() {
    debugger;
    this.masterSelected = this.InventoryDataBind.every(function (item: any) {
      return item.isSelected == true;
    })
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    debugger;
    this.checkedList = [];
    for (var i = 0; i < this.InventoryDataBind.length; i++) {
      if (this.InventoryDataBind[i].isSelected)
        this.checkedList.push(this.InventoryDataBind[i]);
    }
    this.checkedList = JSON.stringify(this.checkedList);
  }



  SelectedCount(item) {
    debugger;
    if (item.isSelected == false) {
      this.isSelectedCount++;
    }
    if (item.isSelected == true) {
      this.isSelectedCount--;
    }
  }
  AllSelectedCount() {
    debugger;
    for (var i = 0; i < this.InventoryDataBind.length; i++) {
      if (this.InventoryDataBind[i].isSelected == false) {
        this.isSelectedCount = this.InventoryDataBind.length;
      }

      if (this.InventoryDataBind[i].isSelected != false) {
        this.isSelectedCount = 0;
      }
    }
  }



  closeaddlocation(form) {
    form.reset();
  }
  closeinvmodal() {

    this.CurrentInventoryObj = {
      partId: 0,
      partName: "",
      partDescription: "",
      quantity: 0,
      costPerUnit: 0,
      uomId: 0,
      uomName: "",
      inventoryId: 0,
      locationId: 0,
      locationName: "",
      statusValue: "",
      attributeFields: [],
      circumstanceFields: [],
      stateFields: [],
      customFields: [],
      eventConfiguartion: null
    }
    // let el1: HTMLElement = this.AddCustomFieldClose.nativeElement;
    // el1.click();

    // let el2: HTMLElement = this.AddAttributeClose.nativeElement;
    // el2.click();
    // let el3: HTMLElement = this.AddUOMClose.nativeElement;

    // console.log('click');
  }
  StatementHistory(item) {
    debugger;
    this.InventoryTransactionObj = item;
    this.CustomFields.forEach(element => {
      element.columnValue = "";
    });
    item.StatementHistoryOpen = !item.StatementHistoryOpen;
    this.selectedItem = item;
  }
  ShowUploadActivity() {
    debugger;
    this.UploadActivityOpen = true;
  }
  getValue(value: boolean) {
    this.UploadActivityOpen = false;
  }

  showDropDown = false;

  toggleDropDown() {
    debugger
    this.showDropDown = !this.showDropDown;
    console.log('clicked');
  }
  closeDropDown() {
    debugger
    this.showDropDown = false;
    console.log('clicked outside');
  }
  selectFiles(event) {
    debugger
    this.progressInfos = [];

    const files = event.target.files;
    let isImage = true;

    for (let i = 0; i < files.length; i++) {
      if (files.item(i).type.match('image/jpg') || files.item(i).type.match('image/jpeg') || files.item(i).type.match('image/png')) {
        var selectedFile = event.target.files[i];
        this.selectedFiles.push(selectedFile);
        // this.listOfFiles.push(selectedFile.name);
        var reader = new FileReader();


        reader.onload = (event: any) => {

          this.listOfFiles.push(event.target.result);

          this.myForm.patchValue({
            fileSource: this.listOfFiles
          });
        }

        reader.readAsDataURL(event.target.files[i]);

        continue;
      } else {
        isImage = false;
        this.toastr.warning('invalid format!');
        break;
      }
    }

  }
  uploadFiles() {
    debugger
    this.spinner.show();
    this.message = '';
    this.libraryService.upload(this.selectedFiles, this.previewItem.partId, this.selectedTenantId, this.authService.accessToken).subscribe(
      event => {
        debugger;
        if (event.entity == true) {
          // document.getElementById("uploadModelClose").click();
          this.toastr.success("Files has been Uploaded", "SuccessFully");
          let el: HTMLElement = this.uploadActivity.nativeElement;
          el.click();

        }
        else {
          this.toastr.warning("Could not upload the files");
        }
        this.spinner.hide();
        this.selectedFiles = [];
        this.listOfFiles = [];
        this.ApplyJsFunction();
      },
      err => {
        this.toastr.warning("Could not upload the files");
      });

  }
  triggerFalseClick() {
    let el: HTMLElement = this.UploadImage.nativeElement;
    el.click();
  }
  RemoveImageName(index) {
    debugger;

    this.listOfFiles.splice(index, 1);
    // delete file from FileList
    this.selectedFiles.splice(index, 1);
    this.images.splice(index, 1);

  }

  // preview image
  previewImage(currentItemToShow) {
    debugger;
    this.previewItem = currentItemToShow;
    this.name = currentItemToShow.partName
    this.imageObject = [];
    this.previewItem.images.forEach(element => {
      this.imageObject.push({
        image: 'https://clearly2020storage.blob.core.windows.net:443/images/' + element.imageFriendlyName,
        thumbImage: 'https://clearly2020storage.blob.core.windows.net:443/images/' + element.imageFriendlyName,
        alt: 'alt of image',
        title: element.imageFriendlyName
      });
    });

    this.cdr.detectChanges();
  }
  cancel() {
    this.selectedFiles = [];
    this.listOfFiles = [];
    this.previewItem = [];
    this.imageObject = [];

  }
}
