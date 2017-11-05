import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagerSideComponent } from './manager-side.component';

// export const routes: Routes = [
//     { path: 'home', component: HomeComponent }
// ];

// export const routing = RouterModule.forChild(routes);

const routes: Routes = [
    { path: 'manager', component: ManagerSideComponent }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class routing {}