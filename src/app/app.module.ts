import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { SharedModule }     from './shared/shared.module';
import { routing }          from './app.routing';

import { ManagerLoginModule } from './components/manager-login/manager-login.module';
import { ManagerSideModule } from './components/manager-side/manager-side.module';

import { AppComponent } from './app.component';

import './rxjs-operators';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'jesse-shop'}),
    FormsModule,
    HttpModule,
    routing,
    SharedModule,
    ManagerLoginModule,
    ManagerSideModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
