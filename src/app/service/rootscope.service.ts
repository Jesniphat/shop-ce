import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class RootscopeService {
  // Observable navItem source
  // public data:any;
  public doBlock$:Observable<any>;
  public showNav$:Observable<any>;

  private _blockUI: any;
  private _showNav: any;

  constructor() {
    this.doBlock$ = new Observable(observer => this._blockUI = observer);
    this.showNav$ = new Observable(observer => this._showNav = observer);
  }

  // service command
  public loginShow(someObj:any) {
    this._showNav.next(someObj);
  }

  public setBlock(data:boolean) {
    this._blockUI.next({
      block:data
    });
  }
}
