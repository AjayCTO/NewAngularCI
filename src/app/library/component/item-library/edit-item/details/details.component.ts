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

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  @ViewChild('UploadImage') UploadImage: ElementRef<HTMLElement>;
  @Input() item;
  @Input() attributefields;
  selectedFiles: any;
  progressInfos = [];
  message = '';

  // selectedTenantId
  public showProgressBar: boolean;




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
        continue;
      } else {
        isImage = false;
        this.toastr.warning('invalid format!');
        break;
      }
    }

    if (isImage) {
      this.selectedFiles = event.target.files;
    } else {
      this.selectedFiles = undefined;
      event.srcElement.percentage = null;
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
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.upload(i, this.selectedFiles[i]);
    }
  }
  triggerFalseClick() {
    let el: HTMLElement = this.UploadImage.nativeElement;
    el.click();
  }
  RemoveImageName(item) {
    debugger;



    for (var i = this.selectedFiles.length - 1; i > -1; i--) {


      if (this.selectedFiles[i].name == item.name) {
        if (this.selectedFiles[i].name.indexOf(name) >= 0) { }
      }
    }

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

  Close() { }

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
