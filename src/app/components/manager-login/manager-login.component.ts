import { Component, OnInit } from '@angular/core';
import { BrowserModule, Title, Meta } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from "../../service/api.service";

@Component({
  selector: 'app-manager-login',
  templateUrl: './manager-login.component.html',
  styleUrls: ['./manager-login.component.scss']
})
export class ManagerLoginComponent implements OnInit {
  msgs:any;
  error: any;
  response: {};
  password: any;
  username: any;
  storage: any;

  constructor(
    public apiService: ApiService, 
    public title: Title, 
    public meta: Meta,
    public router: Router
  ) {
    title.setTitle('Login to my shop');
    
    meta.addTags([
      { name: 'author',   content: 'jesseshop.com'},
      { name: 'keywords', content: 'jesse shop online, angular 5 universal, etc'},
      { name: 'description', content: 'This is my Angular SEO-based App, enjoy it!' }
    ]);

    this.storage = localStorage;
  }

  ngOnInit() {
    this.getLogin();
  }

  getLogin(){
    let param = {"clear":"login"};
    this.apiService
        .post("/api/authen/clearlogin", param)
        .subscribe(
            res => this.getLoginDoneAction(res),
            error => this.getLoginErrorAction(error)
        );
  }

  getLoginDoneAction(res:any){
    // console.log("res login = ", res);
  }

  getLoginErrorAction(error:any){
      this.error = error.message;
  }

  login(){
    let param = {
      user: this.username,
      password: this.password
    }
    // console.log(param);
    this.apiService
      .post("/api/authen/login", param)
      .subscribe(
          (res) => this.loginDoneAction(res),
          (error) => this.loginErrorAction(error)
      )
  }

  loginDoneAction(res:any){
    // console.log(" res = ", res);
    if(res.status === true){
        let loginData = JSON.stringify(res.data);
        this.storage.setItem('logindata',loginData);
        this.router.navigate(['/manager']);
        // this.$rootScope.loginShow({hiddenTopBar:false, hiddenSideBar:false});
        // window.location.href = "";
        // window.location.reload();
    } else {
        console.log("can't login = ", res.error);
        this.msgs = [];
        this.msgs.push({severity:'warn', summary:'Oops!', detail:res.error});
    }
  }

  loginErrorAction(error:any){
    this.error = error.message;
    console.log("error = ", this.error);
    // setTimeout(() => this.error = null, 4000);
  }

}
