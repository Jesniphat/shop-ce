const promise       = require('bluebird');
const conn          = require('./config');
const jwt           = require('jwt-simple');

module.exports = new function() {
  // console.log("permistion");
  this.secret     = "xxx";
  this.cookieName = "user";

///////////// read tokem method  ///////////////////////////////////////////////
  this.readToken = function(req){
    var token = req.cookies[this.cookieName];
    // console.log("Before decode : ", token);
    if(token == undefined){
      token = {id:0};
    }else {
      token = jwt.decode(token, this.secret)
    }
    // console.log("permission readToken = ", token);
    return token;
  }

///////////// write tokem method  //////////////////////////////////////////////
  this.writeToken = function(res, id){
    var token = {id:id};
    token = jwt.encode(token, this.secret);
    res.cookie(this.cookieName, token);
  }

///////////// clear tokem method  //////////////////////////////////////////////
  this.clearToken = function(res){
    this.writeToken(res, 0);
  }

///////////// islogin tokem method  ////////////////////////////////////////////
  this.isLogin = function(req){
    var token = this.readToken(req);
    // console.log("token is : ", token);
    if(token.id != 0){
      return true;
    }else {
      return false;
    }
  }

///////////// getid tokem method  //////////////////////////////////////////////
  this.getID = function(req) {
    var token = this.readToken(req);
    return token.id;
  }
};