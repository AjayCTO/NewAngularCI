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
import { FormGroup, FormControl, Validators} from '@angular/forms';

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
  public imagePath;
  images = [];
  myForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });
  imgURL: any;
 
  // selectedTenantId
  public showProgressBar: boolean;

  public AssignImageOpen: boolean;


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
    // this.selecteditem= JSON.parse(localStorage.getItem('selectitem'));
    this.attributefields
    this.ApplyJsFunction();

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
        this.listOfFiles.push(selectedFile.name);

        continue;
      } else {
        isImage = false;
        this.toastr.warning('invalid format!');
        break;
      }
    }

    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
              var reader = new FileReader();
 
              reader.onload = (event:any) => {
                console.log(event.target.result);
                 this.images.push(event.target.result); 
 
                 this.myForm.patchValue({
                    fileSource: this.images
                 });
              }

              reader.readAsDataURL(event.target.files[i]);
      }
  }
  }

  uploadFiles() {
    debugger
    this.message = '';
    this.libraryService.upload(this.selectedFiles, this.selectedTenantId, this.authService.accessToken).subscribe(
      event => {
      },
      err => {

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
    
  }
  upload(idx, file) {
    this.progressInfos[idx] = { value: 0, fileName: file.name };

    this.libraryService.upload(file, this.selectedTenantId, this.authService.accessToken).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressInfos[idx].percentage = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.fileInfos = this.libraryService.getFiles();
        }
      },
      err => {
        this.progressInfos[idx].percentage = 0;
        this.message = 'Could not upload the file:' + file.name;
      });
  }
  AssignImage() {
    debugger;
    this.AssignImageOpen = true;
  }
  Close() {
    this.AssignImageOpen = false;
  }

  //Attribute FIELDS
  //  GetAttributeFields() {
  //   debugger; 

  //  this.customfieldservice.GetAttributeFields(this.selectedTenantId, this.authService.accessToken)
  //    .pipe(finalize(() => {
  //      this.busy = false;
  //      this.spinner.hide();
  //    })).subscribe(result => {
  //      this.AttributeFields = [];
  //      debugger;
  //      if (result.code == 200) {
  //        this.AttributeFields = result.entity;
  //      }
  //    })
  // }
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

  }
  ApplyJsFunction() {
    setTimeout(function () {
      inputFocus();
      datePicker();
    }, 1000)
  }

}
