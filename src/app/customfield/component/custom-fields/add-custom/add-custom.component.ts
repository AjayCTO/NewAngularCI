import { Component, OnInit } from '@angular/core';
import { AttributeFields, CustomFields } from '../../../models/customfieldmodel';
// import { CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem } from '@angular/cdk/drag-drop';
// import {Message, MessageService} from 'ui-message-angular';
// import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'app-add-custom',
  templateUrl: './add-custom.component.html',
  styleUrls: ['./add-custom.component.css']
})
export class AddCustomComponent implements OnInit {
  // FieldObject: Object[];    
  // DYNAMIC_FORM_COMPONENTS: Object[] = [
  //   {
  //     etiLeyendaPrincipal: 'Header',
  //     etiNombreObjetoHtml: 'etiTitle',
  //     datIngresos: [{
  //       tobTipoControl: 'label',
  //       datNombreObjHtml: 'etiTitle',
  //       datTipoDato: null

  //     }],
  //     type: 'title',
  //     disabled: false,
  //     value: null
  //   },

  //   {
  //     etiLeyendaPrincipal: 'Nombre:',
  //     etiNombreObjetoHtml: 'etiInput',    
  //     datIngresos: [{

  //       tobTipoControl: 'input',
  //       datNombreObjHtml: 'txtTipo',
  //       datTipoDato: 'text'

  //     }],
  //     type: 'input',
  //     disabled: false,
  //     value: null,
  //   }
  // ];
  // subscription: Subscription;      
  // configuracionesCampoHtml = [];    
  // modificaCampoHtml: any;
  // public contadorConfiguracionCampoHtml = -1;
  // // subscription: any;
  // // messageService: any;
  // get controls() { return this.configuracionesCampoHtml.filter(({ type }) => type !== 'button'); }
  // defaultComponents: Object[] = this.DYNAMIC_FORM_COMPONENTS;
  // textboxData = this.defaultComponents[1];
  // existeFormulario = false;    
  // registroBotones = -1;    
  name = 'Angular';

  origin = [
    {title: 'Text', type:'text'},
    {title: 'Number', type:'number'},
    {title: 'Dropdown', type:'select'},
    {title: 'Radio', type:'radio'},
    {title: 'Checkbox', type:'check'},
    {title: 'Date', type:'date'},
  ];

  destination = [
  ];
  constructor( ) { 
    // this.subscription = this.messageService.getModalToDynamicForm()
    // .subscribe(modificaCampoHtml => {

    //   if (this.existeFormulario) {
    //     this.configuracionesCampoHtml[this.configuracionesCampoHtml
    //       .findIndex(res => res.etiCodigo === modificaCampoHtml.data.etiCodigo)] = modificaCampoHtml.data;
    //   } else {
    //     this.configuracionesCampoHtml[this.configuracionesCampoHtml
    //       .findIndex(res => res.orden === modificaCampoHtml.data.orden)] = modificaCampoHtml.data;
    //   }    
    // });
}


  ngOnInit(): void {
    // this.transferenciaDeObjetoHTML(this.defaultComponents[0])
  }
  // muestraBotones(registro: number) {
  //   this.registroBotones = registro;
  // }
  // drop(event: CdkDragDrop<string[]>) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     let item:any = event.previousContainer.data[event.previousIndex];
  //     let copy:any = JSON.parse(JSON.stringify(item));
  //     let element:any = {};
  //     for(let attr in copy){
  //       if(attr == 'title'){
  //         element[attr] = copy[attr] += ' copy';
  //       }else{
  //         element[attr] = copy[attr];
  //       }
  //     }
  //     this.destination.splice(event.currentIndex,0, element);
  //   }
  // }
  // transferenciaDeObjetoHTML($event: any) {
  //   let nuevoControl: any = {};
  //   nuevoControl = $event;
  //   this.contadorConfiguracionCampoHtml++;
  //   nuevoControl.orden = this.contadorConfiguracionCampoHtml;
  //   nuevoControl.datNombreObjHtml = `${nuevoControl['datIngresos'][0].datNombreObjHtml}${this.contadorConfiguracionCampoHtml}`;
  //   this.configuracionesCampoHtml.push(nuevoControl);    
  // }
 }

