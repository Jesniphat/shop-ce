import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagerLoginComponent } from './manager-login.component';

const routes: Routes = [
    { path: 'system-login', component: ManagerLoginComponent }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class routing {}