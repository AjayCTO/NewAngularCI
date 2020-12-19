import { Component, Input, OnInit } from '@angular/core';
import { LibraryService } from '../../service/library.service';
import { AuthService } from '../../../core/auth.service';
import { finalize } from 'rxjs/operators';
import { ItemLibraryComponent } from '../../component/item-library/item-library.component'
import { InventoryTransactionViewModel } from '../../models/library-model';
import inputFocus from '../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../assets/js/lib/_inputClear';

@Component({
  selector: 'app-image-library',
  templateUrl: './image-library.component.html',
  styleUrls: ['./image-library.component.scss']
})
export class ImageLibraryComponent implements OnInit {
  @Input() item;
  selectedFiles: File[] = [];
  listOfFiles: any[] = [];
  progressInfos = [];
  message = '';
  imagesId: any = [];
  allImages: any;
  public selectedTenantId: number;
  public NotPermitted: boolean = false;
  public edititem: boolean;
  public selecteditem: any = [];
  imgURL: any;
  public searchFilterText: string = "";
  pageSize = 10;
  pageIndex = 0;
  length = 100;
  lastPageIndex = 0;
  public AssignImageOpen: boolean;
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
  constructor(private libraryService: LibraryService, private authService: AuthService) { }

  ngOnInit(): void {
    debugger;
    this.selecteditem = this.item;
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));
    this.GetAllImage();
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

  AssignImagefromGallery() {
    debugger;
    this.AssignImageOpen = true;
    this.GetAllImage();
  }
  Close() {
    this.AssignImageOpen = false;
  }

  triggerFalseClick() {


  }
  selectid(id) {
    debugger;
    this.imagesId = id;
  }
  RemoveSearchFilter() {
    debugger;

    this.searchFilterText = ""
    this.GetAllImage();
  }
  GetAllImage() {
    debugger;
    this.libraryService.GetTenantImages(this.selectedTenantId, this.pageSize, this.pageIndex, this.searchFilterText, this.authService.accessToken)
      .pipe(finalize(() => {

        //this.spinner.hide();
      })).subscribe(result => {
        if (result.code == 403) {
          this.NotPermitted = true;

        }
        debugger;

        this.allImages = [];
        console.log(result.entity);
        this.length = result.entity.images.length;
        this.allImages = result.entity.images;

      })
  }
  AssignImages() {
    debugger;
    this.libraryService.AllocateDeallocateImages(this.selectedTenantId, this.InventoryTransactionObj.partId, this.imagesId, this.authService.accessToken)
      .pipe(finalize(() => {

        //this.spinner.hide();
      })).subscribe(result => {
        if (result.code == 403) {
          this.NotPermitted = true;

        }
        debugger;

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
}


