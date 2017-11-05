import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from "./api.service";

@Injectable()
export class ProductStorageService {

  /**
   * 
   * Variable
   */
  public storage: any;
  public productList: any = [];
  public $scope: any;

  /**
   * 
   * Observable varaible
   */
  public $productList:Observable<any>;

  /**
   * 
   * Oberver data
   */
  public _producList:any;

/**
 * Construtor of class
 * 
 * @param apiService
 * @access public
 * @return void
 */
  public constructor(public apiService: ApiService) {
    this.$productList = new Observable(observer => this._producList = observer);
  }


  /**
   * Automatic start function
   * 
   * @access public 
   */
  public ngOnInit(){
    let $scope:any;
  }

  /**
   * Get Data to aucompelte 
   * 
   * @access public
   * @param call back
   * @return call back
   */
  public productListGetting(){
    let $scope:any;
    let that = this;
    this.getMaxProductId(this.apiService)
    .then(this.getProductList)
    .then((data) => {
      console.log("test");
      that._producList.next(data);
      // resule(data);
    })
    .catch((error) => {
      console.log(error);
      that._producList.next(error);
      // error(error);
    });
  }

  /**
   * Get Max id frm data base
   * 
   * @access public
   * @return promise
   */
  public getMaxProductId(apiService): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      apiService
      .post("/api/product/maxProductUpdate",{})
      .subscribe(
          data => {
            let param = {
              apiService: apiService,
              max_update: data.data
            }
            return resolve(param); 
          },
          error => {
            console.log(error);
            return reject(error)
          }
      );
    });
  }


  /**
   * Get productlist from server
   * 
   * @access public
   */
  public getProductList(param):Promise<any> {
   let storage = localStorage;
   let productList = [];
    // Get data from local storage
    if(storage.getItem('productlist')){
      productList = JSON.parse(storage.getItem('productlist'));
    }

    return new Promise<any>((resolve, reject) => {
      let listData:any;
      if(productList.length != 0){
        if(productList[productList.length - 1].updated_date === param.max_update){
          return resolve(productList);
        }else{
          // Select by last id
          let setMax = '2000-10-01';
          if(new Date(productList[productList.length - 1].updated_date) < new Date(param.max_update)){
            setMax = productList[productList.length - 1].updated_date;
          } else {
            setMax = param.max_update;
          }
          // console.log(setMax);
          param.apiService
          .post("/api/product/getAllProductStore",{'max_update':setMax})
          .subscribe(
              (resule) => { 
                // console.log(resule);
                if(!resule.status){
                  return resolve(productList);
                } else {
                  resule.data.forEach(element => {
                    let newDate = productList.filter(function(el) {
                      return el.id !== element.id;
                    });
                    productList = newDate;
                    productList.push(element);
                  });
                  storage.setItem('productlist',JSON.stringify(productList));
                  return resolve(productList);
                } 
              },
              (error) => {
                console.log(error);
                return reject(error);
              }
          );
        }
      }else{
        //Select all first
        param.apiService
        .post("/api/product/getAllProductStore",{'max_update':'2000-10-01'})
        .subscribe(
          (result) => { 
            // console.log(result); 
            storage.setItem('productlist',JSON.stringify(result.data));
            return resolve(result.data); 
          },
          (error) => {
            console.log(error);
            return reject(error);
          }
        );
      }
    });
  }


  /**
   * When Remove Product Out
   * 
   * @param product 
   * @access public
   * @return productList
   */
  public deleteProductStore(product: any){
    let storage = localStorage;
    let productList = [];
    // Get data from local storage
    if(storage.getItem('productlist')){
      productList = JSON.parse(storage.getItem('productlist'));
    }

    let newDate = productList.filter(function(el) {
      return el.id !== product.id;
    });
    productList = newDate;
    storage.setItem('productlist',JSON.stringify(productList));
    this._producList.next(productList);
  }

}
