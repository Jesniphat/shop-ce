import { NgModule ,ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiService } from "../service/api.service";
import { RootscopeService } from "../service/rootscope.service";
import { CookieService } from "../service/cookie.service";
import { DialogService } from "../service/dialog.service";
import { ProductStorageService } from '../service/product-storage.service';
import { MenuListService } from '../service/menu-list.service';

import { TableFilterPipe } from '../pipes/table-filter.pipe';
import { PageNumberPipe } from '../pipes/page-number.pipe';
import { PageListPipe } from '../pipes/page-list.pipe';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ TableFilterPipe, PageNumberPipe, PageListPipe ],
  exports:      [ TableFilterPipe, PageNumberPipe, PageListPipe ],
  providers:    [ ApiService, RootscopeService, CookieService, DialogService, ProductStorageService, MenuListService ]
})

export class SharedModule {}
