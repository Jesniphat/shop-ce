import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from "@angular/http";
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { SharedModule } from "../../shared/shared.module";
import { ManagerLoginComponent } from './manager-login.component';
import { routing } from "./manager-login.routing";

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    BrowserModule,
    FormsModule,
    SharedModule,
    routing
  ],
  declarations: [
    ManagerLoginComponent
  ],
  bootstrap: [
    ManagerLoginComponent
  ]
})
export class ManagerLoginModule { }
