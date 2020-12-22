import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { LibraryService } from '../../../../service/library.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { AuthService } from '../../../../../core/auth.service';

import modal from '../../../../../../assets/js/lib/_modal';
import { ToastrService } from 'ngx-toastr';
import { CustomFieldService } from '../../../../../customfield/service/custom-field.service'
import { finalize } from 'rxjs/operators';
import { CircumstanceFields, StateFields, AttributeFields, CustomFields } from '../../../../../customfield/models/customfieldmodel';
import { NgxSpinnerService } from 'ngx-spinner';
import inputFocus from '../../../../../../assets/js/lib/_inputFocus';
import inputClear from '../../../../../../assets/js/lib/_inputClear';
import datePicker from '../../../../../../assets/js/lib/_datePicker';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Item } from 'src/app/currentinventory/models/admin.models';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  @ViewChild('UploadImage') UploadImage: ElementRef<HTMLElement>;
  @Input() item;
  @Input() attributefields;
  selectedFiles: File[] = [];
  listOfFiles: any[] = [];
  progressInfos = [];
  message = '';
  public partId: number;
  public imagePath;
  error: string;
  allImages: any;
  public NotPermitted: boolean = false;
  images = [];
  myForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });
  imgURL: any;
  public searchFilterText: string = "";
  pageSize = 8;
  pageIndex = 0;
  length = 100;
  lastPageIndex = 0;
  // selectedTenantId
  public showProgressBar: boolean;

  public AssignImageOpen: boolean;

  public ImageIds = [];
  public AssignImageIds = [];
  fileInfos: Observable<any>;
  // public AttributeFields:any;
  public busy: boolean;
  public CustomFields: any;
  public selectedTenantId: number;
  public edititem: boolean;
  public selecteditem: any = [];
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
  constructor(private libraryService: LibraryService, private toastr: ToastrService, private authService: AuthService, private customfieldservice: CustomFieldService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    debugger;
    this.selecteditem = this.item;
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));

    modal();

    this.Attributevalue();


    // this.ApplyJsFunction();

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
    this.spinner.show();
    this.message = '';
    this.libraryService.upload(this.selectedFiles, this.item.partId, this.selectedTenantId, this.authService.accessToken).subscribe(
      event => {
        debugger;
        if (event.entity == true) {
          document.getElementById("uploadModelClose").click();
          this.toastr.success("Files has been Uploaded", "SuccessFully");
        }
        else {
          this.toastr.warning("Could not upload the files");
        }
        this.spinner.hide();
        this.ApplyJsFunction();
      },
      err => {
        this.toastr.warning("Could not upload the files");
      });

  }

  CheckImageSelect(imageId) {
    let Index = this.ImageIds.indexOf(imageId);
    if (Index == -1) {
      this.ImageIds.push(imageId)
    }
    else {
      this.ImageIds.splice(Index, 1);
    }

  }
  checkForAssign(imageId) {
    let Index = this.AssignImageIds.indexOf(imageId);
    if (Index == -1) {
      this.AssignImageIds.push(imageId)
    }
    else {
      this.AssignImageIds.splice(Index, 1);
    }
  }


  triggerFalseClick() {
    let el: HTMLElement = this.UploadImage.nativeElement;
    el.click();
  }
  RemoveImageName(index) {

    this.listOfFiles.splice(index, 1);
    // delete file from FileList
    this.selectedFiles.splice(index, 1);
    this.images.splice(index, 1);

  }

  AssignImagefromGallery() {
    debugger;
    this.AssignImageOpen = true;
    modal();
    this.GetAllImage();
  }
  Close() {
    this.AssignImageOpen = false;
  }
  RemoveSearchFilter() {
    debugger;

    this.searchFilterText = ""
    this.GetAllImage();
  }
  splitthevalue(item) {
    debugger;
    for (var i = 0; i < item.length; i++) {
      if (item[i].customFieldSpecialType === 'OpenField') {
        if (item[i].customFieldPrefix != null) {
          item[i].columnValue.split(item.customFieldPrefix.Value, item.customFieldPrefix.Value.length);
          this.attributefields = item;
        }
      }
    }
  }


  deallocationImages() {
    debugger;
    this.libraryService.AllocateDeallocateImages(this.selectedTenantId, this.item.partId, this.ImageIds, false, this.authService.accessToken).pipe(finalize(() => {

      this.spinner.hide();
    }))
      .subscribe(result => {
        if (result.code == 200) {
          this.toastr.success(result.message);
          this.GetAllImage();
        }
      })
  }

  allocationImages() {
    debugger;
    this.libraryService.AllocateDeallocateImages(this.selectedTenantId, this.item.partId, this.AssignImageIds, true, this.authService.accessToken).pipe(finalize(() => {

      this.spinner.hide();
    }))
      .subscribe(result => {
        if (result.code == 200) {
          this.toastr.success(result.message);
          this.GetAllImage();
        }
      })
  }

  Attributevalue() {
    debugger;
    this.attributefields.forEach(element => {
      element.columnValue = "";
    });

    for (let i = 0; i < this.item.attributeFields.length; i++) {
      for (let j = 0; j < this.attributefields.length; j++) {
        if (this.item.attributeFields[i].columnName == this.attributefields[j].columnName) {

          this.attributefields[j].columnValue = this.item.attributeFields[i].columnValue;

        }
      }
    }
    this.splitthevalue(this.attributefields);
    setTimeout(function () {

      inputFocus();

    }, 500)
    // this.ApplyJsFunction();
  }
  closeEditItem() {
    window.location.reload();
    this.edititem = true;
  }
  ComboValueDropdown(Value) {

    let items = [];
    if (Value != null) {
      items = Value.split('\n');
    }
    return items;
  }
  edit() {
    debugger;
    this.selecteditem.attributeFields = this.attributefields;
    this.partId = this.item.partId
    this.libraryService.EditPart(this.selectedTenantId, this.partId, this.selecteditem, this.authService.accessToken)
      .pipe(finalize(() => {

        this.spinner.hide();
      }))
      .subscribe(
        result => {
          if (result) {

            if (result.entity == true) {
              this.toastr.success("Your item is Successfully update.");
              // this.GetLocation();

            }
            else {
              this.toastr.warning(result.message);
            }

          }
        },
        error => {
          debugger;
          this.error = error.error.message;
          this.spinner.hide();
        });
  }


  ApplyJsFunction() {
    setTimeout(function () {
      inputClear();
      inputFocus();
      datePicker();
    }, 500)
  }

  // get image
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
        this.length = result.entity.totalImages;

        this.allImages = result.entity.images;

      })
  }
  gotoNext() {
    debugger
    this.lastPageIndex = this.length / this.pageSize;
    this.lastPageIndex = parseInt(this.lastPageIndex.toString())
    if (this.pageIndex != this.lastPageIndex) {
      this.pageIndex++;
      this.GetAllImage();
      this.ApplyJsFunction();
    }
  }
  gotoFirstPage() {
    this.pageIndex = 0;
    this.GetAllImage();
    this.ApplyJsFunction();
  }
  gotoBack() {
    if (this.pageIndex > 0) {
      this.pageIndex = this.pageIndex - 1;
      this.GetAllImage();
      this.ApplyJsFunction();
    }
  }
  gotoLastPage() {

    this.pageIndex = this.length / this.pageSize;
    this.pageIndex = parseInt(this.pageIndex.toString())
    this.GetAllImage();
    this.ApplyJsFunction();
  }
  OpenUploadActivity = false;
  ShowUploadActivity() {
    this.OpenUploadActivity = true;
  }
  cancel() {
    this.selectedFiles = [];
    this.listOfFiles = [];
    // this.previewItem = [];
    // this.imageObject = [];

  }
  uploadimg() {
    this.selectedFiles = [];
    this.listOfFiles = [];
  }
}
