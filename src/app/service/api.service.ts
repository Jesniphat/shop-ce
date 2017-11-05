import { Injectable } from '@angular/core';
import { Http, HttpModule, Headers, RequestOptions, Response  }    from '@angular/http';
import { Router } from '@angular/router';
import { Observable }     from 'rxjs/Observable';
import { ResponseData }     from './constructor-variable';


@Injectable()
export class ApiService {
    private prod:boolean = false; 
    // public api:string = "http://127.0.0.1/project_shop_api/api.php";
    // public upl:string = "http://127.0.0.1/project_shop_api/upload.php";
    public api:string = "";
    public upl:string = "";
    public img:string = "http://localhost:8100/";
    // public img:string = "http://192.168.99.100/";

  constructor(private http: Http, public router: Router) {
    //   console.log(location.hostname); 
    //   if(location.hostname == 'localhost'){
    //       this.api = "";
    //       this.upl = "";
    //     //   this.img = "?id=";
    //   }else{
    //     //   this.api = "/api.php";
    //     //   this.upl = "/upload.php";
    //     this.img = "http://" + location.hostname + ":" + location.port + "/";
    //   }
  }

    get(url: string):Observable<ResponseData> {
        return this.http
                .get( this.api + url)
                .map((response: Response) => this.extractData(response)) // .map(this.extractData)
                .catch(this.handleError);
    }

    post(url: string, param:any):Observable<ResponseData> {
        return this.http
                .post(this.api + url, JSON.stringify(param), new RequestOptions({
                    headers: new Headers({"Content-Type": "application/json"})
                }))
                .map((response: Response) => this.extractData(response)) // .map(this.extractData)
                .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        if(body.nologin){
            console.log("go to new login.");
            // window.location.href = "#/system-login";
            this.router.navigate(['/system-login']);
            return body || { }; 
        }else{
            // console.log("body = ", body);
            return body || { };
        }
    }

    private handleError (error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}
