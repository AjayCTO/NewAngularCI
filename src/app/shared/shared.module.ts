import { NgModule } from '@angular/core';

import { ApiService } from './api.service';
import { CommanSharedService } from './service/comman-shared.service';
@NgModule({
  providers: [
    ApiService,
    CommanSharedService,
  ]
})
export class SharedModule { }
