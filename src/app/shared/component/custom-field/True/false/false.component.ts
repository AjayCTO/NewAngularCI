import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { options, PannelDisplay, minimalEditForm, existingOptions } from '../options';
import { FormioCustomComponentInfo, FormioSubmissionCallback, registerCustomFormioComponent } from '@formio/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../../../core/auth.service';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { CustomFieldService } from '../../../../../customfield/service/custom-field.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from '../../../../../dynamic-events/service/event.service';
import { LibraryService } from '../../../../../library/service/library.service';
@Component({
  selector: 'app-false',
  templateUrl: './false.component.html',
  styleUrls: ['./false.component.scss']
})
export class FalseComponent implements OnInit {
  @ViewChild('json') jsonElement?: ElementRef;
  @ViewChild('builder') builderElement?: ElementRef;
  public submitted = false;
  public busy: boolean;
  public error: string;
  public SelectedIcon = "1";
  public selectedFields: any = [];
  public newFormCopy: any;
  public eventFormCopy: any;
  public customFieldsRequired = {
    columnName: '',
    isSelected: true
  }
  public getcustomFieldResult: any = {
    columnId: 0,
    columnName: '',
    columnLabel: '',
  }
  isAllLoaded = false;
  public form: Object = {
    components: PannelDisplay

  };

  eventForm: any = {
    id: 0,
    eventName: '',
    eventColor: '',
    eventIcon: '',
    islocationRequired: false,
    isUOMRequired: false,
    withNewRecord: false,
    withExistRecord: true,
    eventQuantityAction: '',
    eventFormJsonSettings: '',
    customFieldsRequired: []
  };
  public isPreview: boolean = false;
  @Output() rebuildEmitter = new EventEmitter<any>();
  public selectedFieldName: any = []
  constructor(private libraryService: LibraryService, private cd: ChangeDetectorRef, private authService: AuthService, private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService, private customfieldservice: CustomFieldService, private eventService: EventService) {
    this.options = options;

  }
  public options: any;
  public CustomSpecialType: string;

  customField: any = {
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
  selectedTenantId: number = 0;

  public Newform: Object = { components: [] };
  ngOnInit(): void {
    this.spinner.show();
    this.selectedTenantId = parseInt(localStorage.getItem('TenantId'));

    this.GetCustomFields();


  }


  SelectedEvent(type) {
    debugger;
    this.SelectedIcon = type;
  }

  getDataType(field) {

    this.customField = {
      columnId: field.columnId != undefined ? field.columnId : 0,
      columnName: field.columnName != undefined ? field.columnName : '',
      columnLabel: field.label,
      customFieldType: 'CustomField',
      dataType: '',
      columnValue: '',
      comboBoxValue: '',
      customFieldIsRequired: field.validate != undefined ? field.validate.required != undefined ? field.validate.required : false : false,
      customFieldInformation: field.tooltip != undefined ? field.tooltip : '',
      customFieldPrefix: field.prefix != undefined ? field.prefix : "",
      customFieldSuffix: field.suffix != undefined ? field.suffix : "",
      customFieldIsIncremental: false,
      customFieldBaseValue: 0,
      customFieldIncrementBy: 0,
      customFieldTextMaxLength: 0,
      customFieldDefaultValue: field.defaultValue != undefined ? field.defaultValue.toString() : "",
      CustomFieldNumberMin: field.validate != undefined ? field.validate.min != undefined && field.validate.min != "" ? field.validate.min : 0 : 0,
      customFieldNumberMax: field.validate != undefined ? field.validate.max != undefined && field.validate.min != "" ? field.validate.max : 0 : 0,
      customFieldNumberDecimalPlaces: field.decimalLimit != undefined ? field.decimalLimit : 0,
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



    switch (field.type) {

      case "number": {
        this.customField.dataType = "Number";
        if (this.customField.customFieldPrefix == "")
          this.customField.customFieldSpecialType = "Number";
        else
          this.customField.customFieldSpecialType = "Currency";
        break;
      }

      case "radio": {
        this.customField.dataType = "True/False";
        this.customField.customFieldSpecialType = "CheckBox";
        break;
      }
      case "time":
        this.customField.dataType = "Date/Time";
        this.customField.customFieldSpecialType = "Time";
        break;
      case "datetime":
        this.customField.dataType = "Date/Time";
        if (!field.enableTime)
          this.customField.customFieldSpecialType = "Date";
        else
          this.customField.customFieldSpecialType = "Date & Time";
        break;

      case "select":
        {
          this.customField.dataType = "Text";
          this.customField.customFieldSpecialType = "Dropdown";
          this.customField.comboBoxValue = field.data != undefined ? JSON.stringify(field.data.values) : '';
        }
        break;
      case "textfield":
        this.customField.dataType = "Text";
        this.customField.customFieldSpecialType = "OpenField";
        break;
    }

  }

  onChange(event) {
    debugger;
    if (event.form) {
      this.newFormCopy = event.form;
      this.cd.detectChanges();
    }
    this.newFormCopy.forEach(element => {
      element.components.forEach(elements => {
        elements.components.forEach(Element => {
          if (Element.label != event.component.label) {

            if (event.component != undefined) {
              if (event.component.eventQuantityAction != undefined) {
                if (event.component.components != undefined) {
                  event.component.components.forEach(element => {
                    if (element.key == "fieldsetToThisLocation" || element.key == "fieldsetToThisLocation1" || element.key == "fieldsetToThisLocation2") {
                      this.libraryService.GetLocation(this.selectedTenantId, this.authService.accessToken)
                        .pipe(finalize(() => {
                          this.busy = false;
                          this.spinner.hide();
                        })).subscribe(result => {
                          if (result.code == 403) {
                          }
                          else {
                            if (result.entity != null) {
                              element.data.values = [];
                              result.entity.forEach(location => {
                                element.data.values.push({ value: location.locationId, label: location.locationName });
                              });
                            }
                          }
                        });
                    }
                    if (element.key == "fieldsetwithUom" || element.key == "fieldsetwithUom1" || element.key == "fieldsetwithUom2") {
                      this.libraryService.GetUOM(this.selectedTenantId, this.authService.accessToken)
                        .pipe(finalize(() => {
                          this.busy = false;
                          this.spinner.hide();
                        })).subscribe(result => {
                          if (result.code == 403) {
                          }
                          else {
                            if (result.entity != null) {
                              element.data.values = [];
                              result.entity.forEach(uom => {
                                element.data.values.push({ value: uom.uomId, label: uom.uomName });
                              });
                            }
                          }
                        });
                    }


                  });
                }
                this.eventForm.eventQuantityAction = event.component.eventQuantityAction;
                // this.Newform = event.form;
              }

              if (event.type == "addComponent") {
                debugger;

                if (event.component.isNew) {
                  this.getDataType(event.component);
                  this.customfieldservice.AddCustomFields(this.customField, this.selectedTenantId, this.authService.accessToken)
                    .pipe(finalize(() => {
                      this.spinner.hide();
                    }))
                    .subscribe(
                      result => {

                        if (result.code == 200) {
                          this.getcustomFieldResult = result.entity;
                          event.component.key = this.getcustomFieldResult.columnName;
                          event.component.columnId = this.getcustomFieldResult.columnId;
                          event.component.columnName = this.getcustomFieldResult.columnName;
                          event.component.isNew = false;

                          this.toastr.success("Your custom field is Successfully add.");
                          this.customField = {
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
                          // this.router.navigate(['Dynamic/CreateEvent']);
                          this.cd.detectChanges();
                        }
                        else {
                          this.toastr.warning(result.message);
                          this.cd.detectChanges();
                        }
                      },
                      error => {
                        //this.error = error;
                        this.spinner.hide();
                      });

                }

                // else {

                //   let isExist = false;
                //   debugger;
                //   if (this.newFormCopy != undefined) {
                //     this.newFormCopy.components[0].components.forEach(element => {
                //       if (element.eventQuantityAction != undefined) {
                //         isExist = true;
                //       }
                //     });
                //     if (isExist) {
                //       this.toastr.warning("Action Qauntity Already Exist Please Delete and Create New");
                //       this.form = this.newFormCopy
                //     }
                //     else {
                //       this.newFormCopy = event.form;
                //     }

                //   }

                // }

              }
              if (event.type == "saveComponent") {
                debugger;
                if (event.component.columnId != undefined) {
                  this.getDataType(event.component);
                  this.customfieldservice.AddCustomFields(this.customField, this.selectedTenantId, this.authService.accessToken)
                    .pipe(finalize(() => {
                      this.spinner.hide();
                    }))
                    .subscribe(
                      result => {

                        if (result.code == 200) {
                          this.toastr.success("Your custom field is Successfully Update.");
                          this.customField = {
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
                          // this.router.navigate(['Dynamic/CreateEvent']);
                          this.cd.detectChanges();
                        }
                        else {
                          this.toastr.warning(result.message);
                          this.cd.detectChanges();
                        }
                      },
                      error => {
                        //this.error = error;
                        this.spinner.hide();
                      });

                }

              }
            }
          }
          else {
            if (Element.label == event.component.label) {
              this.toastr.warning("Already Exist");
            }
          }
        });
      });
    });


  }
  CustomFields: any = [];
  ExistingFiledOptions: any = existingOptions;

  GetCustomFields() {
    this.customfieldservice.GetCustomFields(this.selectedTenantId, this.authService.accessToken)
      .pipe(finalize(() => {
        //this.busy = false;
        this.spinner.hide();
      })).subscribe(result => {
        this.CustomFields = [];
        debugger;
        if (result.code == 403) {
          // this.NotPermitted = true;
        }
        else {

          if (result.entity != null) {

            this.options.builder.existingFields.components = [];
            this.CustomFields = result.entity;

            this.CustomFields.forEach(element => {
              if (element.dataType == "Text") {
                debugger;
                this.options.builder.existingFields.components[element.columnLabel] = {
                  title: element.columnLabel,
                  schema: {
                    label: element.columnLabel,
                    placeholder: element.columnLabel,
                    tableView: true,
                    isNew: false,
                    prefix: element.customFieldPrefix,
                    suffix: element.customFieldSuffix,
                    tooltip: element.customFieldInformation,
                    key: element.columnName,
                    columnName: element.columnName,
                    columnId: element.columnId,
                    multiple: false,
                    protected: false,
                    unique: true,
                    type: "textfield",
                    validate: {
                      max: element.customFieldNumberMax,
                      min: element.customFieldNumberMin,
                      required: element.isRequired
                    }
                  }
                };

              }
              if ((element.dataType == "Number" && element.customFieldSpecialType == "") || (element.dataType == "Number" && element.customFieldSpecialType == "Number")) {
                debugger;
                this.options.builder.existingFields.components[element.columnLabel] = {
                  title: element.columnLabel,
                  schema: {
                    label: element.columnLabel,
                    placeholder: element.columnLabel,
                    tableView: true,
                    defaultValue: element.customFieldDefaultValue,
                    decimalLimit: element.customFieldNumberDecimalPlaces,
                    mask: false,
                    isNew: false,
                    requireDecimal: false,
                    spellcheck: true,
                    tooltip: element.customFieldInformation,
                    key: element.columnName,
                    columnName: element.columnName,
                    columnId: element.columnId,
                    multiple: false,
                    protected: false,
                    unique: true,
                    type: "number",
                    validate: {
                      max: element.customFieldNumberMax,
                      min: element.customFieldNumberMin,
                      required: element.isRequired
                    }
                  }
                };

              }
              if (element.dataType == "Number" && element.customFieldSpecialType == "Currency") {
                debugger;
                this.options.builder.existingFields.components[element.columnLabel] = {
                  title: element.columnLabel,
                  input: true,
                  schema: {
                    label: element.columnLabel,
                    placeholder: element.columnLabel,
                    tableView: true,
                    mask: false,
                    isNew: false,
                    requireDecimal: false,
                    spellcheck: true,
                    defaultValue: element.customFieldDefaultValue,
                    prefix: element.customFieldPrefix,
                    tooltip: element.customFieldInformation,
                    key: element.columnName,
                    columnName: element.columnName,
                    columnId: element.columnId,
                    type: "number",
                    validate: {
                      max: false,
                      min: false,
                      required: element.isRequired
                    }

                  }
                };

              }
              if ((element.dataType == "Date/Time" && element.customFieldSpecialType == "") || (element.dataType == "Date/Time" && element.customFieldSpecialType == "Date")) {
                debugger;
                this.options.builder.existingFields.components[element.columnLabel] = {
                  title: element.columnLabel,
                  input: true,
                  schema: {
                    label: element.columnLabel,
                    tableView: true,
                    mask: false,
                    enableTime: false,
                    isNew: false,
                    defaultValue: element.columnValue,
                    useLocaleSettings: false,
                    tooltip: element.customFieldInformation,
                    key: element.columnName,
                    columnName: element.columnName,
                    columnId: element.columnId,
                    type: "datetime",
                    validate: {
                      required: element.isRequired
                    }

                  }
                };

              }
              if (element.dataType == "Date/Time" && element.customFieldSpecialType == "Date & Time") {
                debugger;
                this.options.builder.existingFields.components[element.columnLabel] = {
                  title: element.columnLabel,
                  input: true,
                  schema: {
                    label: element.columnLabel,
                    tableView: true,
                    enableMaxDateInput: false,
                    enableMinDateInput: false,
                    mask: false,
                    isNew: false,
                    defaultValue: element.columnValue,
                    useLocaleSettings: false,
                    tooltip: element.customFieldInformation,
                    key: element.columnName,
                    columnName: element.columnName,
                    columnId: element.columnId,
                    type: "datetime",
                    validate: {
                      required: element.isRequired
                    }

                  }

                };

              }
              if (element.dataType == "Date/Time" && element.customFieldSpecialType == "Time") {
                debugger;
                this.options.builder.existingFields.components[element.columnLabel] = {
                  title: element.columnLabel,
                  input: true,
                  schema: {
                    label: element.columnLabel,
                    tableView: true,
                    mask: false,
                    isNew: false,
                    defaultValue: element.columnValue,
                    tooltip: element.customFieldInformation,
                    key: element.columnName,
                    columnName: element.columnName,
                    columnId: element.columnId,
                    type: "time",
                    validate: {
                      required: element.isRequired
                    }

                  }

                };

              }
              if (element.dataType == "Text" && element.customFieldSpecialType == "Dropdown") {
                let JsonData = JSON.parse(element.comboBoxValue);
                this.options.builder.existingFields.components[element.columnLabel] = {
                  title: element.columnLabel,
                  input: true,
                  schema: {
                    label: element.columnLabel,
                    tableView: true,
                    isNew: false,
                    tooltip: element.customFieldInformation,
                    key: element.columnName,
                    columnName: element.columnName,
                    columnId: element.columnId,
                    widget: "choicesjs",
                    type: "select",
                    multiple: false,
                    protected: false,
                    unique: true,
                    data: {
                      values: JsonData
                    },
                    validate: {
                      required: element.isRequired
                    }

                  }

                };

              }
              if (element.dataType == "True/False" && element.customFieldSpecialType == "CheckBox") {
                debugger;
                this.options.builder.existingFields.components[element.columnLabel] = {
                  title: element.columnLabel,
                  input: true,
                  schema: {
                    label: element.columnLabel,
                    tableView: true,
                    optionsLabelPosition: "right",
                    isNew: false,
                    tooltip: element.customFieldInformation,
                    key: element.columnName,
                    columnName: element.columnName,
                    columnId: element.columnId,
                    multiple: false,
                    protected: false,
                    unique: true,
                    type: "radio",
                    values: [{
                      label: element.customFieldTrueLabel,
                      value: element.customFieldTrueLabel,
                    }, {
                      label: element.customFieldFalseLabel,
                      value: element.customFieldFalseLabel
                    }],
                    validate: {
                      required: element.isRequired
                    }
                  }

                };

              }
            });
            this.isAllLoaded = true;

            //this.rebuildEmitter.next(options);
            // this.rebuildEmitter.next(this.ExistingFiledOptions);
          }
        }
      })
  }
  SaveEvent() {
    debugger;
    this.cd.detectChanges();
    this.eventForm.eventQuantityAction == ""
    this.spinner.show();
    let Jsonstring = JSON.stringify(this.newFormCopy);
    let JsonData = JSON.parse(Jsonstring);

    // this.eventForm = this.eventformControl.value;
    this.eventForm.eventIcon = this.SelectedIcon.toString();
    this.eventForm.eventColor = JsonData.components[0].theme;
    this.eventForm.eventName = JsonData.components[0].title;
    if (this.eventForm.eventQuantityAction == "") {

      this.toastr.warning("Please Add any Qauntity Action");
      return false;
    }
    if (this.eventForm.eventQuantityAction == 'Add') {
      this.eventForm.withNewRecord = true;
    }
    if (this.eventForm.eventQuantityAction == 'Move') {
      this.eventForm.islocationRequired = true;

    }
    if (this.eventForm.eventQuantityAction == 'Convert') {
      this.eventForm.isUOMRequired = true;
    }

    let selectedComponent = JsonData.components[0].components;
    this.selectedFields = [];
    selectedComponent.forEach(element => {
      this.customFieldsRequired = {
        columnName: '',
        isSelected: true
      }

      if (element.key != "submit" && element.key != "add" && element.key != "remove" && element.key != 'move' && element.key != 'convert') {
        // this.customFieldsRequired.columnName = element.key;
        this.selectedFields.push({
          columnName: element.key,
          isSelected: true
        });
      }
    });

    debugger;
    this.eventForm.eventFormJsonSettings = Jsonstring;
    this.eventForm.customFieldsRequired = this.selectedFields;
    this.eventService.AddEvent(this.selectedTenantId, this.eventForm, this.authService.accessToken).pipe(finalize(() => {
      this.spinner.hide();
    }))
      .subscribe(
        result => {
          if (result) {

            if (result.entity == true) {
              this.toastr.success("Your event is Successfully Added.");
              this.router.navigate(['CurrentInventory']);
            }
            else {
              this.toastr.warning(result.message);
            }
          }
        },
        error => {
          this.error = error;
          this.spinner.hide();
        });

  }

  onSubmit(event) {
    debugger;
    alert('form submitted!')
  }

  onSubmitCustomForm() {
    alert('Curstom alert submitted!')
  }


}
