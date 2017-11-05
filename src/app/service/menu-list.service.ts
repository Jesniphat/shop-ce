import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from "./api.service";

@Injectable()
export class MenuListService {

  /**
   * 
   * Observable varaible // use it!!
   */
  public $menuList:Observable<any>;
  
  /**
   * 
   * Oberver data // tep data
   */
  public _menuList:any;

  constructor(public apiService: ApiService) {
    this.$menuList = new Observable(observer => this._menuList = observer);
  }

  public getMenuList(hasmenu:boolean, page:string){
    if(!hasmenu){
      this._menuList.next([]);
      return;
    }
    
    let param = {
      page: page
    }
    this.apiService
    .post('/api/menu/menulist', param)
    .subscribe(
      (response) => {
        if(response.status){
          this._menuList.next(response.data);
        }else{
          this._menuList.next([]);
        }
      },
      (error) => {
        console.log('can not get menu list', error);
        this._menuList.next([]);
      }
    )
  }

}
