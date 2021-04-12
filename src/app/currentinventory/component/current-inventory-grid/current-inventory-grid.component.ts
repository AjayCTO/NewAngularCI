import { Component, OnInit, OnChanges, ViewEncapsulation, SimpleChanges, TemplateRef, Input, ViewContainerRef, ViewChild, ElementRef, ContentChild, ChangeDetectorRef } from '@angular/core';
import { from, Observable } from 'rxjs';
import { elementAt, finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/auth.service';
import { CurrentInventory, InventoryTransactionViewModel, TransactionTarget, ChangeStateFields, Tenant, DataColumnFilter, ColumnSorting } from '../../models/admin.models';
import { CustomFieldService } from '../../../customfield/service/custom-field.service'
import { LibraryService } from '../../../library/service/library.service';
import { CurrentinventoryService } from '../../service/currentinventory.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommanSharedService } from '../../../shared/service/comman-shared.service';
import { HomeService } from '../../../home/service/home.service';
import toggle from '../../../../assets/js/lib/_toggle';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import modal from '../../../../assets/js/lib/_modal';
import datePicker from '../../../../assets/js/lib/_datePicker';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../../dynamic-events/service/event.service';
import { CircumstanceFields, StateFields, AttributeFields, CustomFields } from '../../../customfield/models/customfieldmodel';
import { SetSelectedTenant, SetSelectedTenantId, SetDefaultInventoryColumn, SetSelectedEvent, SetSelectedCart } from '../../../store/actions/tenant.action';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../shared/appState';
import { ReportService } from '../../../report/service/report.service'
import { IconsComponent } from 'src/app/shared/component/icons/icons.component';
import { JsonHubProtocol } from '@aspnet/signalr';
import { takeUntil } from 'rxjs/operators';
import { selectSelectedTenantId, selectSelectedTenant, selectMyInventoryColumn, getTenantConfiguration } from '../../../store/selectors/tenant.selectors';
import { ThrowStmt } from '@angular/compiler';
import tableDragger from 'table-dragger';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { hasLifecycleHook } from '@angular/compiler/src/lifecycle_reflector';
import {
  DateTimeAdapter,
  OWL_DATE_TIME_FORMATS,
  OWL_DATE_TIME_LOCALE,
  OwlDateTimeComponent,
  OwlDateTimeFormats
} from 'ng-pick-datetime';
import * as _moment from "moment";
import { Moment } from "moment";
import { TenantConfig } from 'src/app/store/models/tenant.model';

const moment = (_moment as any).default ? (_moment as any).default : _moment;

// '../service/report.service';
@Component({
  selector: 'app-current-inventory-grid',
  templateUrl: './current-inventory-grid.component.html',
  styleUrls: ['./current-inventory-grid.component.scss'],
})
export class CurrentInventoryGridComponent implements IconsComponent, OnInit {
  @ViewChild('AddUOMClose', { static: true }) AddUOMClose: ElementRef<HTMLElement>;
  @ViewChild('AddCircumstanceClose', { static: true }) AddCircumstanceClose: ElementRef<HTMLElement>;
  @ViewChild('AddStatesClose', { static: true }) AddStatesClose: ElementRef<HTMLElement>;
  @ViewChild('AddAttributeClose', { static: true }) AddAttributeClose: ElementRef<HTMLElement>;
  @ViewChild('closeInventoryModal', { static: true }) closeInventoryModal: ElementRef<HTMLElement>;
  @ViewChild('AddCustomFieldClose', { static: true }) AddCustomFieldClose: ElementRef<HTMLElement>;
  @ViewChild('closeInventoryViewModel', { static: true }) CloseInventoryViewModel: ElementRef<HTMLElement>;
  @ViewChild('uploadActivity', { static: true }) uploadActivity: ElementRef<HTMLElement>;
  @ViewChild('UploadImage') UploadImage: ElementRef<HTMLElement>;
  @ViewChild('AddButtonClose', { static: true }) AddButtonClose: ElementRef<HTMLElement>;
  @ViewChild('CloseNewFields', { static: true }) CloseNewFields: ElementRef<HTMLElement>;
  @ViewChild('closeToggle', { static: true }) closeToggle: ElementRef<HTMLElement>;

  // Modal Buttons 
  @ViewChild('EditRenameModal', { static: true }) EditRenameModal: ElementRef<HTMLElement>;
  @ViewChild('SaveasModal', { static: true }) SaveasModal: ElementRef<HTMLElement>;
  @ViewChild('ImageModal', { static: true }) ImageModal: ElementRef<HTMLElement>;

  @ViewChild('closeEditInventoryViewModel', { static: true }) CloseEditInventoryViewModel: ElementRef<HTMLElement>;
  @ViewChild('closeSaveasInventoryViewModel', { static: true }) CloseSaveasInventoryViewModel: ElementRef<HTMLElement>;
  @ViewChild('DynamicEventModalOpen', { static: true }) DynamicEventModalOpen: ElementRef<HTMLElement>;
  @ViewChild('CreateNewFieldsModalOpen', { static: true }) CreateNewFieldsModalOpen: ElementRef<HTMLElement>;
  @ViewChild('table', { static: true }) table: ElementRef<HTMLElement>;
  @Input() item;
  public myDT: Date;
  public today: Date;
  public error: string;
  public busy: boolean;
  public EditView: boolean;
  public a: any
  // download as excel file
  fileName = 'ExcelSheet.xlsx';
  public isSelectedCount: number = 0;
  public CheckboxShow = false;
  public SelectedQuery: boolean;
  public selectedTenantId: number;
  public myInventoryField: any;
  public allInventoryItems: any;
  public ImportDataBind: any;
  public AdjustQuantity: number;
  public addTenantForm: FormGroup;
  public IsActive: boolean;
  public selectedItem: any;
  public exportdata: any;
  public showForms: boolean = false;
  public ColumnDataType: string;
  public isSearchFilterActive: boolean = false;
  public FirstEvent: string = "";
  public SecondEvent: string = "";
  public ThirdEvent: string = "";
  public MakeasDefaultView: boolean = false;
  public ViewName: string = "";
  public dragger: any;
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


  // sorting Array
  public SortingArray: any[] = [];
  lengths = 2;
  public Sorting: any = {
    columnName: "",
    displayName: "",
    Order: ""
  }
  imgURL: any;
  // UOM MEASURE , LOCATION & STATUS OBJECT
  public selectedLocation;
  public selectedUOm;
  public uomList: any[];
  public ColumnDataTypeSpecial: string
  public locationsList: any[];
  public statusList: any;
  public selectedStatus: "";
  public showInventoryModel: boolean;
  public ChangeStateFields: ChangeStateFields[] = [];
  public previewItem: any = {};
  public DropdownValue: any = [];
  public columnLength = 5;
  TenantObject: any = { tenantId: 0, name: "", tenantColor: "", accountId: 0, createdBy: "Self" }
  public ChangeStateField: ChangeStateFields = {
    columnName: "",
    columnValue: "",
  };

  public FilterArray: any[] = [];
  public dataColumnFilter: any = {
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

  //Hide Zero
  public HideZero = false;

  //CUSTOM FIELD OBJECT 
  public CustomFields: any;
  public AttributeFields: any;
  attributeFields: AttributeFields = {
    columnId: 0,
    columnName: '',
    columnLabel: '',
    customFieldType: '',
    dataType: '',
    columnValue: '',
    comboBoxValue: '',
    customFieldIsRequired: false,
    customFieldInformation: '',
    customFieldPrefix: '',
    customFieldSuffix: '',
    customFieldIsIncremental: false,
    customFieldBaseValue: 0,
    customFieldIncrementBy: 0,
    customFieldTextMaxLength: 0,
    customFieldDefaultValue: '',
    customFieldNumberMin: 0,
    customFieldNumberMax: 0,
    customFieldNumberDecimalPlaces: 0,
    customFieldTrueLabel: '',
    customFieldFalseLabel: '',
    customFieldSpecialType: '',
    dateDefaultPlusMinus: '',
    dateDefaultNumber: null,
    dateDefaulInterval: '',
    timeDefaultPlusMinus: '',
    timeNumberOfHours: null,
    timeNumberOFMinutes: null,
    offsetDateFields: '',
    offsetTimeFields: '',
  }

  customField: CustomFields = {
    columnId: 0,
    columnName: '',
    columnLabel: '',
    customFieldType: '',
    dataType: '',
    columnValue: '',
    comboBoxValue: '',
    customFieldIsRequired: false,
    customFieldInformation: '',
    customFieldPrefix: '',
    customFieldSuffix: '',
    customFieldIsIncremental: false,
    customFieldBaseValue: 0,
    customFieldIncrementBy: 0,
    customFieldTextMaxLength: 0,
    customFieldDefaultValue: '',
    customFieldNumberMin: 0,
    customFieldNumberMax: 0,
    customFieldNumberDecimalPlaces: 0,
    customFieldTrueLabel: '',
    customFieldFalseLabel: '',
    customFieldSpecialType: '',
    dateDefaultPlusMinus: '',
    dateDefaultNumber: null,
    dateDefaulInterval: '',
    timeDefaultPlusMinus: '',
    timeNumberOfHours: null,
    timeNumberOFMinutes: null,
    offsetDateFields: '',
    offsetTimeFields: '',
  }


  public showQuickAddDropdown = false;
  public showQuickRemoveDropdown = false;


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
  public Month = [{ 'id': '1', 'month': 'Janurary' }, { 'id': '2', 'month': 'February' }, { 'id': '3', 'month': 'March' }, { 'id': '4', 'month': 'April' }, { 'id': '5', 'month': 'May' }, { 'id': '6', 'month': 'June' }, { 'id': '7', 'month': 'July' }, { 'id': '8', 'month': 'August' }, { 'id': '9', 'month': 'September' }, { 'id': '10', 'month': 'October' }, { 'id': '11', 'month': 'November' }, { 'id': '12', 'month': 'December' },]
  public hour = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
  public minutes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
  public seconds = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
  public options = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']


  //ADD NEW ATTRIBUTE FIELD

  public datatype: any = ['Text', 'Number', 'Date/Time', 'True/False']
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
  public addButtonColumn: boolean;

  //Inventory View
  public inventoryViewList: any = [];
  public isDeleteView: boolean = false;
  public InventoryViewToggleButton = false;
  public SelectedView: any;
  public ColspanTable: number;

  //TenantConfiguration
  public tenantConfiguration: TenantConfig;


  //Cart
  public ShowCart: boolean = true;
  public showSelected: boolean = false;
  public GetCartDetails: any;
  public InventoryIds = [];
  constructor(private authService: AuthService, private reportService: ReportService, protected store: Store<AppState>, private formBuilder: FormBuilder, private eventService: EventService, private router: Router, private homeService: HomeService, private cdr: ChangeDetectorRef, private commanService: CommanSharedService, private customfieldservice: CustomFieldService, private toastr: ToastrService, private libraryService: LibraryService, private currentinventoryService: CurrentinventoryService, private spinner: NgxSpinnerService,) {

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
    transactionDate: new Date(),
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

    this.store.pipe(select(selectSelectedTenant)).
      subscribe(event => {
        if (event) {

          this.selectedTenant = event;
          this.selectedTenantId = event.tenantId;
        }
        this.cdr.detectChanges();
      });
    this.store.pipe(select(getTenantConfiguration)).subscribe(config => {
      if (config) {
        debugger
        this.tenantConfiguration = config;
      }
    });


    this.addButtonColumn = false;
    this.EditView = false
    this.ShowCart = true;
    this.showSelected = false;
    this.uomForm = this.formBuilder.group({
      uomName: ['', Validators.required],
    });

    this.isSelectedCount = 0;
    this.searchFilterText = "";
    this.IsInventoryLoaded = false;
    this.IsActive = false;
    this.spinner.show();
    this.GetTenants();

    this.GetAttributeFields();
    this.GetCustomFields();
    this.getLocationList();
    this.getUOMList();
    this.getStatus();
    this.GetEvents();
    this.GetMyInventoryColumn();

    modal();
    this.ApplyJsFunction();


  }

  eidtView() {
    this.EditView = true;
    // let el: HTMLElement = this.closeToggle.nativeElement;
    // el.click();
    this.ApplyJsFunction();
  }

  length: number = 0;
  pageSize = 5;
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
    if (this.searchFilterText != undefined && this.searchFilterText != "") {
      this.isSearchFilterActive = true;
      this.GetCurrentInventory();
      this.ApplyJsFunction();
    }
  }


  RemoveSearchFilter() {
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
    this.CurrentInventoryObj.transactionDate = this.today;
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
              transactionDate: new Date(),
              statusValue: "",
              attributeFields: [],
              circumstanceFields: [],
              stateFields: [],
              customFields: [],
              eventConfiguartion: null
            }
            document.getElementById("closeInventoryModal").click();



            this.GetCurrentInventory();

          }
        },
        error => {
          this.error = error;
          this.spinner.hide();
        });
  }
  Download(type) {

    let sortCol = "PartName";
    let sortDir = "asc";
    let GlobelFilter = {
      FilterArray: this.FilterArray,
      Ids: this.InventoryIds,
      SortArray: this.SortingArray,
    }
    this.currentinventoryService.GetCurrentInventory(this.selectedTenantId, this.authService.accessToken, this.pageIndex + 1, 2000, sortCol, sortDir, this.searchFilterText, this.showSelected, GlobelFilter, this.HideZero)
      .pipe(finalize(() => {
      })).subscribe(result => {

        this.ImportDataBind = [];
        this.allInventoryItems = [];
        this.allInventoryItems = result.entity.items;

        this.length = result.entity.totalItems;
        for (let i = 0; i < this.allInventoryItems.length; i++) {
          let map = new Map<string, any>();
          for (let j = 0; j < this.tabulatorColumn.length; j++) {
            let keys = Object.keys(this.allInventoryItems[i])
            for (let key = 0; key < keys.length; key++) {
              if (keys[key] == this.tabulatorColumn[j].field) {
                map.set(this.tabulatorColumn[j].title, this.allInventoryItems[i][keys[key]])
              }
            }
            for (let k = 0; k < this.allInventoryItems[i].allFields.length; k++) {
              if (this.allInventoryItems[i].allFields[k].columnName == this.tabulatorColumn[j].field) {
                map.set(this.tabulatorColumn[j].title, this.allInventoryItems[i].allFields[k].columnValue)
              }
            }
            for (let k = 0; k < this.allInventoryItems[i].attributeFields.length; k++) {
              if (this.allInventoryItems[i].attributeFields[k].columnName == this.tabulatorColumn[j].field) {

                if (this.tabulatorColumn[j].datatype == "Date/Time") {
                  this.myDT = new Date(this.allInventoryItems[i].attributeFields[k].columnValue)
                  let DateManual = this.myDT.toLocaleDateString();
                  if (this.tabulatorColumn[j].customFieldSpecialType == "Time") {
                    DateManual = this.myDT.toLocaleTimeString()
                  }
                  if (this.tabulatorColumn[j].customFieldSpecialType == "Date & Time") {
                    DateManual = this.myDT.toLocaleString();
                  }
                  if (this.tabulatorColumn[j].customFieldSpecialType == "Date") {
                    DateManual = this.myDT.toLocaleDateString()
                  }
                  map.set(this.tabulatorColumn[j].title, DateManual)
                }
                else {
                  map.set(this.tabulatorColumn[j].title, this.allInventoryItems[i].attributeFields[k].columnValue)
                }
              }
            }

          }
          let jsonObject = {};
          map.forEach((value, key) => {
            jsonObject[key] = value
          });
          this.ImportDataBind.push(jsonObject);
        }
        if (type == "Excel")
          this.downloadFile(this.ImportDataBind);
        else
          this.openPDF(this.ImportDataBind);
      });

    //   console.log(this.exportdata)
    // }),

    error => console.log("Error Downloading The File.")
  }


  public openPDF(Data) {

    let headColumn = Object.keys(Data[0])
    let head = []
    let data = [];
    data.push(Data);
    head.push(headColumn);
    var doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('My PDF Table', 11, 8);
    doc.setFontSize(11);
    doc.setTextColor(100);



    (doc as any).autoTable({
      body: Data,
      theme: 'plain',
      didDrawCell: data => {
        console.log(data.column.index)
      }
    })

    // Open PDF document in new tab
    doc.output('dataurlnewwindow')

    // Download PDF document  
    doc.save('table.pdf');
  }





  downloadFile(data) {

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
  AddNewAttribute(form) {
    // this.spinner.show();


    this.customfieldservice.AddAttributeFields(this.attributeFields, this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        // this.spinner.hide();
      }))
      .subscribe(
        result => {
          if (result) {


            if (result.entity == true) {
              this.toastr.success("Your Attribute Is Successfully Add.");

              this.GetMyInventoryColumn();
              let el: HTMLElement = this.AddAttributeClose.nativeElement;
              el.click();
              form.reset();
              // this.RefreshAttributeField.emit();
              // this.GetAttributeFields();
              setTimeout(function () {
                inputClear();
                inputFocus();
                datePicker();
              }, 500)

            }
            else {
              this.toastr.warning(result.message);
            }
          }
        });

  }

  createAttributeField() {

    setTimeout(() => {
      let el: HTMLElement = this.CreateNewFieldsModalOpen.nativeElement;
      el.click();
    }, 100);
    this.showQuickAddDropdown = !this.showQuickAddDropdown;
  }
  addButtonColumns() {

    var count = 1;
    var IsAddedCounter = 0;
    this.tabulatorColumn.forEach(element => {
      if (element.datatype == "button") {
        count++;
      }
      if (element.isAdded) {
        IsAddedCounter++;
      }
    });

    //this.tabulatorColumn.push({ title: "", field: "eventList_" + count, type: "", datatype: "button", width: "70", id: "008" + count, isAdded: true, eventList: { FirstEvent: '', SecondEvent: '', ThirdEvent: '' } });
    this.tabulatorColumn.splice(IsAddedCounter, 0, { title: "", field: "eventList_" + count, type: "", datatype: "button", width: "70", id: "008" + count, isAdded: true, eventList: { FirstEvent: '', SecondEvent: '', ThirdEvent: '' } });
    this.showQuickAddDropdown = !this.showQuickAddDropdown;
    this.ColspanTable++;

    this.ApplyJsFunction();
    setTimeout(() => {
      this.columnDragDrop();
    }, 200);

  }


  onSubmit() {
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
              transactionDate: new Date(),
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


  function() {
    let el: HTMLElement = this.CloseNewFields.nativeElement;
    el.click();
  }

  updateCard(e, cell) {

    this.isSelectedCount = this.isSelectedCount == undefined ? 1 : this.isSelectedCount + 1;
    cell.getRow().toggleSelect();

  }
  cellContextMenu = [
    {
      label: "Reset Value",
      action: function (e, cell) {
        alert("I M ain ");
        cell.setValue("");
      }
    },
  ];

  getAvailableColumn() {

  }
  addColumn(elementToAdd) {
    this.tabulatorColumn.forEach((element, index) => {
      if (element.id == elementToAdd.id) {
        element.isAdded = true;
        this.ColspanTable++;
      }
    });
    setTimeout(() => {
      this.columnDragDrop();
    }, 200);
  }
  deleteColumn(item) {

    if (item.datatype != 'button') {
      this.tabulatorColumn.forEach((element, index) => {
        if (element.id == item.id) {
          element.isAdded = false;
          var ColumnAdjusttolast = element;
          this.tabulatorColumn.splice(index, 1);
          this.tabulatorColumn.push(ColumnAdjusttolast);
          this.ColspanTable--;
        }
      });
    }
    else {
      this.tabulatorColumn.forEach((element, index) => {
        if (element.field == item.field) {

          this.tabulatorColumn.splice(index, 1);
          this.ColspanTable--;
        }
      });
    }

  }

  // Inventory Column 
  GetMyInventoryColumn() {

    this.tabulatorColumn = [];
    this.commanService.GetMyInventoryColumns(this.selectedTenantId, this.authService.accessToken).pipe(finalize(() => {
      this.busy = false;
      this.spinner.hide();
    })).subscribe(result => {
      if (result.entity != null) {

        this.myInventoryField = result.entity;
        this.myInventoryField.forEach((element, index) => {
          if (element.customeFieldType != "CustomField" && element.customeFieldType != "Report")
            this.tabulatorColumn.push({ id: element.columnId, title: element.columnLabel, isAdded: true, field: element.columnName, type: element.customeFieldType, customFieldSpecialType: element.customFieldSpecialType, datatype: element.dataType, width: element.columnWidth });
        });
        this.ColspanTable = this.tabulatorColumn.length + 3;
        this.store.dispatch(new SetDefaultInventoryColumn(this.myInventoryField));
        this.GetInventoryView();
        this.GetCurrentInventory();
      }
      else {
      }
    })
  }





  OpenDynamicEventModel(dynamicEvent) {
    this.selectedDynamicEvent = dynamicEvent;
    let obj = JSON.parse(dynamicEvent.circumstanceJsonString);
    // this.CustomFields.forEach(element => {
    //   if(element)
    //   element.columnValue = "";
    // });
    for (let j = 0; j < this.CustomFields.length; j++) {
      this.CustomFields[j].customFieldIncludeOnDynamicEvent = obj[this.CustomFields[j].columnName];
    }

    setTimeout(() => {
      let el: HTMLElement = this.DynamicEventModalOpen.nativeElement;
      el.click();
    }, 100);
    this.ApplyJsFunction();
  }


  GroupDynamicEventAction(DynamicEvent) {

    this.store.dispatch(new SetSelectedEvent(DynamicEvent));
    this.router.navigate(['/multipleTransaction', DynamicEvent.eventName]);
  }


  DynamicEventAction(item, dynamicEvent) {

    this.selectedDynamicEvent = dynamicEvent;
    let obj = JSON.parse(dynamicEvent.circumstanceJsonString);
    this.InventoryTransactionObj = item;
    // this.CustomFields.forEach(element => {
    //   element.columnValue = "";
    // });

    for (let i = 0; i < item.customFields.length; i++) {
      for (let j = 0; j < this.CustomFields.length; j++) {
        // if (item.customFields[i].columnName == this.CustomFields[j].columnName) {
        //   if (obj[this.CustomFields[j].columnName]) {
        //     this.CustomFields[j].columnValue = item.customFields[i].columnValue;
        //   }
        // }
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
              this.toastr.success("Your Tenant Is Successfully Add.");
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

  showSelectedInv(action) {

    this.spinner.show();
    this.showSelected = action;
    this.pageIndex = 0;
    this.GetCurrentInventory();
    this.spinner.hide();
  }

  GetCurrentInventory() {
    debugger;
    this.IsInventoryLoaded = false;
    this.loadingRecords = true;
    this.CheckboxShow = false;
    let sortCol = "PartName";
    let sortDir = "asc";
    let GlobelFilter = {
      FilterArray: this.FilterArray,
      Ids: this.InventoryIds,
      SortArray: this.SortingArray,
    }
    this.currentinventoryService.GetCurrentInventory(this.selectedTenantId, this.authService.accessToken, this.pageIndex + 1, this.pageSize, sortCol, sortDir, this.searchFilterText, this.showSelected, GlobelFilter, this.HideZero)
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
            for (let k = 0; k < this.allInventoryItems[i].attributeFields.length; k++) {
              if (this.allInventoryItems[i].attributeFields[k].columnName == this.tabulatorColumn[j].field) {

                if (this.tabulatorColumn[j].datatype == "Date/Time") {
                  if (this.allInventoryItems[i].attributeFields[k].columnValue != "") {
                    this.myDT = new Date(this.allInventoryItems[i].attributeFields[k].columnValue)
                    let DateManual = this.myDT.toLocaleDateString();
                    if (this.tabulatorColumn[j].customFieldSpecialType == "Time") {
                      DateManual = this.myDT.toLocaleTimeString()
                    }
                    if (this.tabulatorColumn[j].customFieldSpecialType == "Date & Time") {
                      DateManual = this.myDT.toLocaleString();
                    }
                    if (this.tabulatorColumn[j].customFieldSpecialType == "Date") {
                      DateManual = this.myDT.toLocaleDateString()
                    }
                    map.set(this.tabulatorColumn[j].field, DateManual)
                  }
                  else {
                    map.set(this.tabulatorColumn[j].field, this.allInventoryItems[i].attributeFields[k].columnValue)
                  }
                }
                else {
                  map.set(this.tabulatorColumn[j].field, this.allInventoryItems[i].attributeFields[k].columnValue)
                }
              }
            }
            map.set("isSelected", false);
            map.set("_children", []);

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


        this.GetCartDetail();


        this.ApplyJsFunction();

        setTimeout(() => {
          this.columnDragDrop();
        }, 200);

      });
  }


  applyGetCartDetails() {
    if (this.GetCartDetails != null) {


      var res = this.GetCartDetails.inventoryIds.split(",").map(Number);
      res.forEach(element => {
        for (var i = 0; i < this.InventoryDataBind.length; i++) {
          if (this.InventoryDataBind[i].inventoryId == element)
            this.InventoryDataBind[i].isSelected = true;
        }

      });

      this.InventoryIds = res;
      this.store.dispatch(new SetSelectedCart(res));
    }
    else {
      this.InventoryIds = [];
    }

  }

  //Column Drag and Drop
  columnDragDrop() {
    var thisJs = this;
    var id = document.getElementById("table");
    if (this.dragger != undefined) {
      this.dragger.destroy();
    }
    this.dragger = tableDragger(id, {
      mode: 'column',
      onlyBody: true,
      dragHandler: '.handle',
      dropHandler: '.handle',
      animation: 300
    });
    this.dragger.on('drop', function (oldIndex, newIndex, el, mode) {
      thisJs.ChangeOrder(oldIndex, newIndex, el, mode)
    });
  }
  public ChangeOrder(oldIndex, newIndex, el, mode) {

    let oldI = oldIndex - 2
    let newI = newIndex - 2
    this.tabulatorColumn = this.array_move(this.tabulatorColumn, oldI, newI)
  }

  array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
  };


  FilterOperartorSelect(data) {

    if (data == 'Equals') {
      this.dataColumnFilter.filterOperator = 'eq'
    }
    if (data == 'Does Not Equal') {
      this.dataColumnFilter.filterOperator = 'ne'
    }
    if (data == 'Contains') {
      this.dataColumnFilter.filterOperator = 'cn'
    }
    if (data == 'Does NOT Contain') {
      this.dataColumnFilter.filterOperator = 'nc'
    }
    if (data == 'Is Empty') {
      this.dataColumnFilter.filterOperator = 'Empty'
    }
    if (data == 'Begins With') {
      this.dataColumnFilter.filterOperator = 'bw'
    }
    if (data == 'Number Equals') {
      this.dataColumnFilter.filterOperator = 'num-eq'
    }
    if (data == 'Number Not Equal') {
      this.dataColumnFilter.filterOperator = 'num-ne'
    }
    if (data == 'Less Than or Equals') {
      this.dataColumnFilter.filterOperator = 'num-lte'
    }
    if (data == 'Greater Than or Equals') {
      this.dataColumnFilter.filterOperator = 'num-gte'
    }
    if (data == 'DateEquals') {
      this.dataColumnFilter.filterOperator = 'date-eq'
    }
    if (data == 'TimeEquals') {
      this.dataColumnFilter.filterOperator = 'time-eq'
    }
    if (data == 'Date Between') {
      this.dataColumnFilter.filterOperator = 'date-bw'
    }
    if (data == 'Minute Equals') {
      this.dataColumnFilter.filterOperator = 'date-minute'
    }
    if (data == 'Hour Equals') {
      this.dataColumnFilter.filterOperator = 'date-hour'
    }
    if (data == 'Second Equals') {
      this.dataColumnFilter.filterOperator = 'date-second'
    }
    if (data == 'Month Equals') {
      this.dataColumnFilter.filterOperator = 'date-month'
    }
    if (data == 'Day Equals') {
      this.dataColumnFilter.filterOperator = 'date-day'
    }
    if (data == 'Year Equals') {
      this.dataColumnFilter.filterOperator = 'date-year'
    }
    if (data == 'On Or After') {
      this.dataColumnFilter.filterOperator = 'date-after'
    }
    if (data == 'On Or Before') {
      this.dataColumnFilter.filterOperator = 'date-before'
    }
    if (data == 'On Or Time After') {
      this.dataColumnFilter.filterOperator = 'time-after'
    }
    if (data == 'On Or Time Before') {
      this.dataColumnFilter.filterOperator = 'time-before'
    }
    this.ApplyJsFunction200();
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
  RemoveSorting(data) {
    this.SortingArray.forEach((element, index) => {

      if (element.columnName == data.columnName) {
        this.SortingArray.splice(index, 1);
      }
    })
    this.tabulatorColumn.forEach(element => {

      if (element.field == data.columnName) {
        element.inSort = false;
      }
    });
  }
  ApplySort() {
    debugger;
    if (this.Sorting.columnName == "" || this.Sorting.Order == "") {
      return false;
    }

    this.tabulatorColumn.forEach(element => {
      if (element.field == this.Sorting.columnName) {
        this.Sorting.displayName = element.title;
        element.inSort = true;
      }
    });
    if (this.SortingArray.length <= this.lengths) {
      this.SortingArray.push(this.Sorting)
      this.Sorting = {
        columnName: "",
        displayName: "",
        Order: ""
      }
    }
    else {
      this.toastr.warning("You can not add more than 3 Column For Sorting");
    }
    this.mainsortToggleDropdown = false;
  }
  getStatus() {
    this.libraryService.GetStatus(this.selectedTenantId, this.authService.accessToken).pipe(finalize(() => {
      this.busy = false;
    })).subscribe(result => {

      this.statusList = result.entity;

    })
  }

  GetEvents() {

    this.eventService.GetEvents(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
        this.spinner.hide();
      })).subscribe(result => {

        if (result.entity != null) {

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
    this.tabulatorColumn.forEach(element => {
      var pre = element.type == "AttributeField" ? '$.' : '';
      if (pre + element.field == data.columnName) {
        element.inFilter = false;
      }
    });
    this.IsInventoryLoaded = false;
    this.GetCurrentInventory();
    this.ApplyJsFunction();
  }

  ClearAllFilter() {
    this.FilterArray = [];
    this.searchFilterText = "";
    this.tabulatorColumn.forEach(element => {
      element.inFilter = false;
    });
    this.GetCurrentInventory();
    this.ApplyJsFunction();
  }
  ClearAllSorts() {
    this.SortingArray = [];
    this.tabulatorColumn.forEach(element => {
      element.inSort = false;
    });
    // this.searchFilterText = "";
    this.GetCurrentInventory();
    this.ApplyJsFunction();
  }
  onOptionsSelected(event) {
    // send selected value
    this.tabulatorColumn.forEach(element => {
      if (element.field == event) {
        this.ColumnDataType = element.datatype;
        this.ColumnDataTypeSpecial = element.customFieldSpecialType
      }
    });
    this.ApplyJsFunction();
  }
  closeButton() {
    this.addButtonColumn = false;
    document.getElementById("addbuttonClose").click();
    this.ApplyJsFunction();
  }
  onOptionsSelected2(event) {
    this.tabulatorColumn.forEach(element => {
      if (element.field == event) {
        this.ColumnDataType = element.datatype;
        element.opentoggleDropdown = true;
      }
    });
    this.ApplyJsFunction();
  }

  ApplyFilter() {
    if (this.dataColumnFilter.columnName == "" || this.dataColumnFilter.filterOperator == "" || this.dataColumnFilter.searchValue == "") {
      return false;
    }
    this.tabulatorColumn.forEach(element => {
      if (element.field == this.dataColumnFilter.columnName) {
        this.dataColumnFilter.displayName = element.title;
        this.dataColumnFilter.type = element.type;
        this.dataColumnFilter.datatype = element.datatype;
        element.inFilter = true;
        if (element.datatype == "Date/Time") {
          this.GetDate(element);
        }
      }
    });
    this.FilterArray.forEach((element, index) => {
      let attribute = this.dataColumnFilter.type == "" ? '' : "$.";
      if (element.columnName == attribute + this.dataColumnFilter.columnName) {
        this.FilterArray.splice(index, 1);
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
    this.mainToggleDropdown = false;
    this.GetCurrentInventory();
    this.ApplyJsFunction();
  }
  CloseFilter() {
    this.mainToggleDropdown = false;
  }
  ApplyFilter2(columnName) {
    this.dataColumnFilter.columnName = columnName;
    if (this.dataColumnFilter.columnName == "" || this.dataColumnFilter.filterOperator == "" || this.dataColumnFilter.searchValue == "") {
      return false;
    }
    this.tabulatorColumn.forEach(element => {
      if (element.field == this.dataColumnFilter.columnName) {
        this.dataColumnFilter.displayName = element.title;
        this.dataColumnFilter.type = element.type;
        this.dataColumnFilter.datatype = element.datatype;
        element.inFilter = true;
        element.opentoggleDropdown = !element.opentoggleDropdown
        if (element.datatype == "Date/Time") {
          this.GetDate(element);
        }
      }
    });
    this.FilterArray.forEach((element, index) => {
      let attribute = this.dataColumnFilter.type == "" ? '' : "$.";
      if (element.columnName == attribute + this.dataColumnFilter.columnName) {
        this.FilterArray.splice(index, 1);
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
    this.ApplyJsFunction();
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
    this.customfieldservice.GetCustomFields(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        this.busy = false;
        this.spinner.hide();
      })).subscribe(result => {
        this.CustomFields = [];
        if (result.code == 200) {
          this.CustomFields = result.entity;
          this.CustomFields.forEach(element => {
            if (element.comboBoxValue != "") {
              element.comboBoxArray = JSON.parse(element.comboBoxValue);
            }
          });
          this.ApplyJsFunction();
        }
      })
  }
  onChangeSearch(val: string) {
    if (val == "" || val == undefined) {
      this.data = [];
      this.isLoadingResult = false;
    } else {
      this.CurrentInventoryObj.partName = val;
      this.isLoadingResult = true;
      this.commanService.GetItemWithTerm(val, this.selectedTenantId, this.authService.accessToken,)
        .subscribe(response => {
          this.data = response.entity;
          console.log(this.data);
          this.isLoadingResult = false
          this.cdr.detectChanges();
        });
    }
  }
  // getServerResponse(event) {
  //   this.ItemAutocompleteChange();


  // }
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
  CustomComboValueDropdown(Value) {
    this.DropdownValue = [];
    if (Value != null) {
      this.DropdownValue = JSON.parse(Value);
    }
    return this.DropdownValue;
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
      inputClear();
      inputFocus();
      datePicker();
    }, 1000)
  }
  //Checkbox Group activity
  checkUncheckAll() {
    for (var i = 0; i < this.InventoryDataBind.length; i++) {
      this.InventoryDataBind[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }
  isAllSelected() {
    this.masterSelected = this.InventoryDataBind.every(function (item: any) {
      return item.isSelected == true;
    })
    this.getCheckedItemList();
  }
  getCheckedItemList() {
    for (var i = 0; i < this.InventoryDataBind.length; i++) {
      if (this.InventoryDataBind[i].isSelected) {
        let AddIndex = this.InventoryIds.indexOf(this.InventoryDataBind[i].inventoryId)
        if (AddIndex == -1) {
          this.InventoryIds = Object.assign([], this.InventoryIds);
          this.InventoryIds.push(this.InventoryDataBind[i].inventoryId);
        }
      }
      else {
        let RemoveIndex = this.InventoryIds.indexOf(this.InventoryDataBind[i].inventoryId)
        if (RemoveIndex != -1) {
          this.InventoryIds = Object.assign([], this.InventoryIds);
          this.InventoryIds.splice(RemoveIndex, 1);
        }
      }
    }
    this.SaveCart();
  }
  SaveCart() {
    let viewId = this.SelectedView != undefined ? this.SelectedView.id : 0;
    let carts = [];
    let currentCart = [];
    this.InventoryIds.forEach(element => {
      carts.push({ inventoryId: element })
      currentCart.push(element);
    });
    this.store.dispatch(new SetSelectedCart(currentCart));
    this.currentinventoryService.saveCart(this.selectedTenantId, this.authService.accessToken, viewId, carts).subscribe(res => {
      if (res.code == 200) {

      }
    })
  }
  clearCart() {
    for (var i = 0; i < this.InventoryDataBind.length; i++) {
      this.InventoryDataBind[i].isSelected = false;
    }
    this.checkedList = [];
    this.InventoryIds = [];
    this.masterSelected = false;
    this.SaveCart();
  }
  GetCartDetail() {
    let viewId = this.SelectedView != undefined ? this.SelectedView.id : 0;
    this.currentinventoryService.getCartdetails(this.selectedTenantId, this.authService.accessToken, viewId).subscribe(res => {
      if (res.code == 200) {
        this.GetCartDetails = res.entity;
        this.applyGetCartDetails();
      }
      else {
      }
    })
  }
  closeaddlocation(form) {
    form.reset();
  }
  closeinvmodal(form) {
    this.CurrentInventoryObj = {
      partId: 0,
      partName: "",
      partDescription: "",
      quantity: 1,
      costPerUnit: 0,
      uomId: 0,
      uomName: "",
      inventoryId: 0,
      locationId: 0,
      transactionDate: new Date(),
      locationName: "",
      statusValue: "",
      attributeFields: [],
      circumstanceFields: [],
      stateFields: [],
      customFields: [],
      eventConfiguartion: null
    }
  }
  StatementHistory(item) {
    this.InventoryTransactionObj = item;
    this.CustomFields.forEach(element => {
      element.columnValue = "";
    });
    item.StatementHistoryOpen = !item.StatementHistoryOpen;
    this.selectedItem = item;
  }
  ShowUploadActivity() {
    this.UploadActivityOpen = true;
  }
  getValue(value: boolean) {
    this.UploadActivityOpen = false;
  }
  showDropDown = false;
  toggleQuickDropdown(type) {
    if (type == "add")
      this.showQuickAddDropdown = !this.showQuickAddDropdown;
    else
      this.showQuickRemoveDropdown = !this.showQuickRemoveDropdown;
  }
  toggleGlobalDropDown(event) {
    this.FirstEvent = ""; this.SecondEvent = ""; this.ThirdEvent = "";
    this.tabulatorColumn.forEach(element => {
      if (element.field == event) {
        this.ColumnDataType = element.datatype;
        element.opentoggleDropdown = !element.opentoggleDropdown;
        if (element.eventList != undefined) {
          this.FirstEvent = element.eventList.FirstEvent; this.SecondEvent = element.eventList.SecondEvent; this.ThirdEvent = element.eventList.ThirdEvent;
        }
      }
    });
    this.ApplyJsFunction200();
  }
  closeGlobalDropDown(event) {
    this.tabulatorColumn.forEach(element => {
      if (element.field == event) {
        this.ColumnDataType = element.datatype;
        element.opentoggleDropdown = !element.opentoggleDropdown;
      }
    });
  }
  AddQuickColumn(item) {
    item.eventList = {
      FirstEvent: this.FirstEvent,
      SecondEvent: this.SecondEvent,
      ThirdEvent: this.ThirdEvent
    }
    this.closeGlobalDropDown(item.field);
  }
  toggleDropDown() {
    this.showDropDown = !this.showDropDown;
    console.log('clicked');
  }
  closeDropDown() {
    this.showDropDown = false;
    console.log('clicked outside');
  }
  selectFiles(event) {
    this.progressInfos = [];
    const files = event.target.files;
    let isImage = true;
    for (let i = 0; i < files.length; i++) {
      if (files.item(i).type.match('image/jpg') || files.item(i).type.match('image/jpeg') || files.item(i).type.match('image/png')) {
        var selectedFile = event.target.files[i];
        this.selectedFiles.push(selectedFile);
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
        if (event.entity == true) {
          this.toastr.success("Files Has Been Uploaded", "SuccessFully");
          this.spinner.hide();
          // let el: HTMLElement = this.uploadActivity.nativeElement;
          // el.click();
          window.location.reload();
        }
        else {
          this.toastr.warning("Could Not Upload The Files");
        }
        this.spinner.hide();
        this.selectedFiles = [];
        this.listOfFiles = [];
        this.ApplyJsFunction();
      },
      err => {
        this.toastr.warning("Could Not Upload The Files");
      });
  }
  triggerFalseClick() {
    let el: HTMLElement = this.UploadImage.nativeElement;
    el.click();
  }
  RemoveImageName(index) {
    this.listOfFiles.splice(index, 1);
    this.selectedFiles.splice(index, 1);
    this.images.splice(index, 1);
  }
  // preview image
  previewImage(currentItemToShow) {

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
    let el: HTMLElement = this.ImageModal.nativeElement;
    el.click();
    this.ApplyJsFunction200()
    this.cdr.detectChanges();
  }
  cancel() {
    this.selectedFiles = [];
    this.listOfFiles = [];
    this.previewItem = [];
    this.imageObject = [];
  }
  // ======== Add new custom function=====
  AddNewCustomfield() {
    this.customfieldservice.AddCustomFields(this.customField, this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
      }))
      .subscribe(
        result => {
          if (result) {
            if (result.code == 200) {
              this.toastr.success("Your CustomField Is Successfully Add.");
              let el: HTMLElement = this.AddCustomFieldClose.nativeElement;
              el.click();
              // this.GetCustomFields();
              // this.RefreshCustomField.emit();
              // form.reset();
              // this.GetAttributeFields();
              // setTimeout(function () {
              //   inputClear();
              //   inputFocus();
              //   datePicker();
              // }, 500)
            }
            else {
              this.toastr.warning(result.message);
            }
          }
        });
  }
  // ============ Save View Function ========
  save() {
    // this.customreport.ColumnFilter = this.columnFilters;
    this.reportService.AddCustomReport(this.selectedTenantId, this.authService.accessToken, 1).subscribe((result => {
      if (result.code == 200) {
        this.router.navigate(['/report/event-report']);
      }
    }))
    this.EditView = false
  }
  //====================== Convert String to Date and Time ================
  ConvertStringToDate(stringDate, Type) {
    this.myDT = new Date(stringDate);
    let DateManual = this.myDT.toLocaleDateString();
    if (Type == "Time") {
      DateManual = this.myDT.toLocaleTimeString()
    }
    if (Type == "Date & Time") {
      DateManual = this.myDT.toLocaleString();
    }
    if (Type == "date-eq") {

      DateManual = this.myDT.toLocaleDateString()
    }
    return DateManual;
  }
  //////////////////////////////////////
  CreateInventoryView() {
    let Data = {
      MakeAsDefault: this.MakeasDefaultView,
      ViewName: this.ViewName,
      ColumnJsonSettings: JSON.stringify(this.tabulatorColumn),
      ColumnFilterSettings: JSON.stringify(this.FilterArray)
    }
    this.currentinventoryService.CreateInventoryView(this.selectedTenantId, this.authService.accessToken, Data).subscribe(res => {
      if (res.code == 200) {
        this.toastr.success("Created View Successfully", "View");
        let el: HTMLElement = this.CloseInventoryViewModel.nativeElement;
        el.click();
        this.InventoryViewToggleButton = !this.InventoryViewToggleButton;
        this.GetInventoryView();
      }
      else {
        this.toastr.error(res.message);
      }
    })
  }

  GetInventoryView() {
    this.currentinventoryService.GetInventoryView(this.selectedTenantId, this.authService.accessToken).subscribe(res => {
      if (res.code == 200) {
        this.inventoryViewList = res.entity;
        this.inventoryViewList.forEach(element => {
          if (element.makeAsDefault) {
            this.InventoryViewToggleButton = true;
            return this.SelectView(element);
          }
        });
      }
    });
  }
  DefaultView() {
    this.store.pipe(select(selectMyInventoryColumn)).
      subscribe(myInventoryColumn => {
        if (myInventoryColumn) {
          this.tabulatorColumn = [];
          this.myInventoryField.forEach((element, index) => {
            if (element.customeFieldType != "CustomField" && element.customeFieldType != "Report")
              this.tabulatorColumn.push({ id: element.columnId, title: element.columnLabel, isAdded: true, field: element.columnName, type: element.customeFieldType, customFieldSpecialType: element.customFieldSpecialType, datatype: element.dataType, width: element.columnWidth });
          });
          this.ColspanTable = this.tabulatorColumn.length + 3;
          this.SelectedView = null;
          this.GetCurrentInventory();
        }
        this.cdr.detectChanges();
      });
  }
  createViewToggle() {
    this.InventoryViewToggleButton = !this.InventoryViewToggleButton;
    setTimeout(() => {
      modal();
    }, 200);
  }
  InventoryEditViewTogleButton = false;
  EditViewToggle() {
    this.InventoryEditViewTogleButton = !this.InventoryEditViewTogleButton;
    setTimeout(() => {
      modal();
    }, 200);
  }
  SelectView(view) {
    this.InventoryIds = [];
    this.ColspanTable = 3;
    this.spinner.show();
    this.SelectedView = view;
    let NewColumn = [];
    let selectedViewColumn = JSON.parse(view.columnJsonSettings);
    selectedViewColumn.forEach(element => {
      if (element.datatype != "button") {
        this.tabulatorColumn.forEach(Nestelement => {
          if (element.field == Nestelement.field) {
            Nestelement.isAdded = element.isAdded;
            Nestelement.width = element.width;
            NewColumn.push(Nestelement);
          }
        });
      }
      else {
        NewColumn.push(element);
      }
    });

    this.tabulatorColumn = NewColumn;
    this.FilterArray = JSON.parse(view.columnFilterSettings);
    this.InventoryViewToggleButton = !this.InventoryViewToggleButton;
    this.tabulatorColumn.forEach(element => {
      if (element.isAdded)
        this.ColspanTable++;
    });
    setTimeout(() => {
      this.spinner.hide();
    }, 200);
    this.GetCurrentInventory();
  }
  DeleteInventoryView() {
    this.isDeleteView = true;
  }
  ConfirmDeleteView() {
    this.currentinventoryService.DeleteInventoryView(this.selectedTenantId, this.authService.accessToken, this.SelectedView.id).subscribe(res => {
      if (res.code == 200) {
        this.toastr.success("SuccessFully Deleted", this.SelectedView.viewName)
        this.InventoryEditViewTogleButton = !this.InventoryEditViewTogleButton;
        this.isDeleteView = false;
        this.SelectedView = null;
        this.GetMyInventoryColumn();
        this.GetInventoryView();
      }
      else {
        this.toastr.error(res.message);
      }
    })
  }
  EditInventoryView() {
    this.currentinventoryService.EditInventoryView(this.selectedTenantId, this.authService.accessToken, this.SelectedView, this.SelectedView.id).subscribe(res => {
      if (res.code == 200) {
        this.toastr.success("Successfully Updated", this.SelectedView.viewName);
        let el: HTMLElement = this.CloseEditInventoryViewModel.nativeElement;
        el.click();
        this.InventoryEditViewTogleButton = false;
        this.GetInventoryView();
      }
      else {
        this.toastr.error(res.message);
      }
    })
  }
  RenameView() {
    this.ViewName = this.SelectedView.viewName;
    this.MakeasDefaultView = this.SelectedView.makeAsDefault;
    this.InventoryEditViewTogleButton = !this.InventoryEditViewTogleButton;
    let el: HTMLElement = this.EditRenameModal.nativeElement;
    el.click();
    this.ApplyJsFunction200()
  }
  SaveView() {
    var SearchFieldsTable = $("#table thead>tr");
    let thisjs = this;
    var trows = SearchFieldsTable[0].children;
    $.each(trows, function (index, row) {
      var ColumnWidth = $(row).attr("columnIdWidth");
      if (ColumnWidth != undefined) {
        thisjs.tabulatorColumn[index - 2].width = ColumnWidth;
      }
    })
    this.SelectedView.columnJsonSettings = JSON.stringify(this.tabulatorColumn);
    this.SelectedView.columnFilterSettings = JSON.stringify(this.FilterArray);
    this.EditInventoryView();
  }
  SaveAsViewModal() {
    this.ViewName = "";
    this.MakeasDefaultView = false;
    this.InventoryEditViewTogleButton = !this.InventoryEditViewTogleButton;
    let el: HTMLElement = this.SaveasModal.nativeElement;
    el.click();
    this.ApplyJsFunction200()
  }
  SaveAsView() {
    this.CreateInventoryView();
  }
  MakeInventoryViewDefaut() {
    this.currentinventoryService.MakeasDefault(this.selectedTenantId, this.authService.accessToken, this.SelectedView.id, this.SelectedView,).subscribe(res => {
      if (res.code == 200) {
        this.toastr.success("SuccessFully Make As Defualt", this.SelectedView.viewName)
        this.InventoryEditViewTogleButton = !this.InventoryEditViewTogleButton;
        this.GetInventoryView();
      }
      else {
        this.toastr.error(res.message);
      }
    })
  }
  OnlyRenameView() {
    this.SelectedView.makeAsDefault = this.MakeasDefaultView,
      this.SelectedView.viewName = this.ViewName,
      this.EditInventoryView();
  }
  GetDate(element) {
    if (this.dataColumnFilter.filterOperator == 'date-eq') {
      this.GetdateFilter(element)
    }
    if (this.dataColumnFilter.filterOperator == 'time-eq') {
      this.GetdateFilter(element)
    }
    if (this.dataColumnFilter.filterOperator == 'date-bw') {
      let date1 = new Date(this.dataColumnFilter.searchValue[0]).toLocaleDateString();
      let date2 = new Date(this.dataColumnFilter.searchValue[1]).toLocaleDateString();
      this.dataColumnFilter.datevalue = date1 + " to " + date2;
      this.dataColumnFilter.searchValue = new Date(this.dataColumnFilter.searchValue[0]).toISOString() + " ~ " + new Date(this.dataColumnFilter.searchValue[1]).toISOString();
    }
    if (this.dataColumnFilter.filterOperator == 'date-minute') {
      this.dataColumnFilter.datevalue = this.dataColumnFilter.searchValue;
    }
    if (this.dataColumnFilter.filterOperator == 'date-hour') {
      this.dataColumnFilter.datevalue = this.dataColumnFilter.searchValue;
    }
    if (this.dataColumnFilter.filterOperator == 'date-second') {
      this.dataColumnFilter.datevalue = this.dataColumnFilter.searchValue;
    }
    if (this.dataColumnFilter.filterOperator == 'date-day') {
      this.dataColumnFilter.datevalue = this.dataColumnFilter.searchValue;
    }
    if (this.dataColumnFilter.filterOperator == 'date-after') {
      this.GetdateFilter(element)
    }
    if (this.dataColumnFilter.filterOperator == 'date-before') {
      this.GetdateFilter(element)
    }
    if (this.dataColumnFilter.filterOperator == 'time-before') {
      this.GetdateFilter(element)
    }
    if (this.dataColumnFilter.filterOperator == 'time-after') {
      this.GetdateFilter(element)
    }
  }
  GetdateFilter(element) {
    this.myDT = new Date(this.dataColumnFilter.searchValue)
    let DateManual = this.myDT.toLocaleDateString();
    if (element.customFieldSpecialType == "Time") {
      DateManual = this.myDT.toLocaleTimeString()
    }
    if (element.customFieldSpecialType == "Date & Time") {
      DateManual = this.myDT.toLocaleString();
    }
    if (element.customFieldSpecialType == "Date" || element.customFieldSpecialType == "") {
      DateManual = this.myDT.toLocaleDateString()
    }
    this.dataColumnFilter.datevalue = DateManual;
  }
  ApplyJsFunction200() {
    setTimeout(function () {
      inputClear();
      inputFocus();
      datePicker();
    }, 200)
  }
  // public dateTime = new FormControl(moment());
  chosenYearHandler(normalizedYear: Date, datepicker: OwlDateTimeComponent<Moment>) {
    this.dataColumnFilter.searchValue = normalizedYear;
    this.dataColumnFilter.datevalue = normalizedYear.getFullYear();
    datepicker.close();
  }
  chosenMonthHandler(
    normalizedMonth: Date,
    datepicker: OwlDateTimeComponent<Moment>
  ) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    this.dataColumnFilter.searchValue = normalizedMonth;
    this.dataColumnFilter.datevalue = monthNames[normalizedMonth.getMonth()];
    datepicker.close();
  }
  mainToggleDropdown = false;
  MainFilterToggle() {
    this.mainToggleDropdown = !this.mainToggleDropdown;
  }
  mainsortToggleDropdown = false;
  MainSortToggle() {
    this.mainsortToggleDropdown = !this.mainsortToggleDropdown;
  }
  hideZero() {
    this.HideZero = !this.HideZero;
    this.GetCurrentInventory();
    this.ApplyJsFunction();
  }
}
