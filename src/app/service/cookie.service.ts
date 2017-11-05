import { Injectable } from '@angular/core';

@Injectable()
export class CookieService {

  constructor() { }

  public setCookie(name: string, value: string) {
    document.cookie = name + "=" + value + "; ";
  }

  public deleteCookie(name:any) {
    this.setCookie(name, "");
  }

  public getCookie(name: string) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }

}
