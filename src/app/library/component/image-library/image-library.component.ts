import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LibraryService } from '../../service/library.service';
import { AuthService } from '../../../core/auth.service';
import { finalize } from 'rxjs/operators';
import { ItemLibraryComponent } from '../../component/item-library/item-library.component'
import { InventoryTransactionViewModel } from '../../models/library-model';
import { CommanSharedService } from '../../../shared/service/comman-shared.service';
import { CurrentInventory } from '../../../currentinventory/models/admin.models';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import modal from '../../../../assets/js/lib/_modal'
@Component({
  selector: 'app-image-library',
  templateUrl: './image-library.component.html',
  styleUrls: ['./image-library.component.scss']
})
export class ImageLibraryComponent implements OnInit {
  @ViewChild('UploadImage') UploadImage: ElementRef<HTMLElement>
  @Input() item;
  selectedFiles: File[] = [];
  listOfFiles: any[] = [];
  progressInfos = [];
  message = '';
  imagesId: any = [];
  allImages: any;
  keys: string[] = [];
  Value: String[] = [];
  images = [];
  public data: any;
  public selectedTenantId: number;
  public IsItemHave: boolean = false;
  public NotPermitted: boolean = false;
  public selectitem: boolean = false;
  public edititem: boolean;
  public selecteditem: any = [];
  imgURL: any;
  public searchFilterText: string = "";
  pageSize = 10;
  pageIndex = 0;
  length = 100;
  lastPageIndex = 0;
  public AssignImageOpen: boolean;
  keyword = 'partName';
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

  }
  public partid: number;
  public partName: any;
  public partNames: any;
  public isLoadingResult: boolean = false;
  constructor(private libraryService: LibraryService, private authService: AuthService, private toastr: ToastrService, private commanService: CommanSharedService, private spinner: NgxSpinnerService) { }


  ngOnInit(): void {

    // this.spinner.show();
    this.selecteditem = this.item;
    this.partid = 0;
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    this.spinner.show();
    modal();
    this.GetAllImage();
    setTimeout(function () {

      inputFocus();

    }, 500)

  }

  // get part() {
  //   item
  // }
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

        }

        reader.readAsDataURL(event.target.files[i]);

        continue;
      } else {
        isImage = false;

        break;
      }
    }

  }
  ApplyJsFunction() {
    setTimeout(function () {
      inputClear();
      inputFocus();

    }, 500)
  }
  getServerResponse(event) {

    this.ItemAutocompleteChange();
    this.partName = event;
    this.isLoadingResult = true;
    this.commanService.GetItemWithTerm(event, this.selectedTenantId, this.authService.accessToken,)
      .subscribe(response => {
        this.data = response.entity;
        this.isLoadingResult = false;
      });

  }
  ItemAutocompleteChange() {
    // this.CurrentInventoryObj.partId = 0;
    this.IsItemHave = false;
  }
  selectEvent(item) {

    this.selectitem = true;
    let itemJsonobject: any[];
    itemJsonobject = JSON.parse(item.attributeFieldsJsonSettings);
    this.keys = Object.keys(itemJsonobject);
    this.Value = Object.values(itemJsonobject);
    this.partid = item.partId;
    this.partNames = item.partName;

    // this.CurrentInventoryObj.partDescription = this.selecteditem.partDescription;
    // this.selectedUOm = item.uomId;
    // this.selectedLocation = item.locationId;
    // this.selectedStatus = item.statusValue;


  }
  AssignImagefromGallery() {

    this.AssignImageOpen = true;
    this.GetAllImage();
  }
  Close() {
    this.AssignImageOpen = false;
  }

  triggerFalseClick() {

    let el: HTMLElement = this.UploadImage.nativeElement;
    el.click();
  }
  // selectid(id) {
  //   
  //   this.imagesId = id;
  // }

  CheckImageSelect(imageId) {

    let Index = this.imagesId.indexOf(imageId);
    if (Index == -1) {
      this.imagesId.push(imageId)
    }
    else {
      this.imagesId.splice(Index, 1);
    }

  }
  RemoveSearchFilter() {


    this.searchFilterText = ""
    this.GetAllImage();
  }
  GetAllImage() {


    this.libraryService.GetTenantImages(this.selectedTenantId, this.pageSize, this.pageIndex, this.searchFilterText, this.authService.accessToken)
      .pipe(finalize(() => {

        this.spinner.hide();
      })).subscribe(result => {
        if (result.code == 403) {
          this.NotPermitted = true;

        }

        // this.spinner.hide();
        this.allImages = [];
        console.log(result.entity);
        this.length = result.entity.images.length;
        this.allImages = result.entity.images;

      })
  }
  AssignImages() {

    this.spinner.show();
    this.libraryService.AllocateDeallocateImages(this.selectedTenantId, this.partid, this.imagesId, true, this.authService.accessToken)
      .pipe(finalize(() => {

        this.spinner.hide();
      })).subscribe(result => {
        if (result.code == 403) {
          this.NotPermitted = true;

        }
        if (result.code == 200) {
          this.toastr.success(result.message);
          window.location.reload();
          this.GetAllImage()
        }
        else {
          this.toastr.warning("You Can't Assign Image");
        }

        this.imagesId = [];
        // this.toastr.success(result.message);

        // this.allImages = [];
        // console.log(result.entity);
        // this.length = result.entity.images.length;
        // this.allImages = result.entity.images;

      })
  }

  gotoNext() {
    debugger
    this.GetAllImage();
  }
  gotoFirstPage() {
    this.GetAllImage();
  }
  gotoBack() {
    this.GetAllImage();
  }
  gotoLastPage() {
    this.GetAllImage();
  }
  uploadFiles() {

    this.spinner.show();
    this.message = '';
    this.libraryService.upload(this.selectedFiles, this.partid, this.selectedTenantId, this.authService.accessToken).subscribe(
      event => {

        if (event.entity == true) {

          document.getElementById("uploadModelClose").click();
          this.toastr.success("Files Has Been Uploaded", "SuccessFully");
          this.GetAllImage()
        }
        else {
          this.toastr.warning("Could Not Upload The files");
        }
        this.spinner.hide();
        this.ApplyJsFunction();
      },
      err => {
        this.toastr.warning("Could Not Upload The Files");
      });

  }
  RemoveImageName(index) {

    this.listOfFiles.splice(index, 1);
    // delete file from FileList
    this.selectedFiles.splice(index, 1);
    this.images.splice(index, 1);

  }
  cancel() {
    this.selectedFiles = [];
    this.listOfFiles = [];
    // this.previewItem = [];
    // this.imageObject = [];

  }

}


