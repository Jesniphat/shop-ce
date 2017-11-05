const express = require('express');
const Promise = require('bluebird');
const router = express.Router();
const md5 = require('md5');
const conn = require('../library/config');
const permission = require('../library/permission');

const db = require('../library/db');

router.post('/checklogin', function(req, res, next){
  // console.log("check login");
  let isLogin = permission.isLogin(req);
  
  res.json({
    status: true,
    data: isLogin
  });
});

router.post("/clearlogin", function(req, res, next){
  permission.clearToken(res);
  // console.log("permission : ", permission.readToken(req));
  res.json({
    status: true,
    data: "set0"
  });
});

router.post("/login", function(req, res, next) {
  let connection = conn.init();
  let login = req.body;
  let $scope;

  let login_data = function(){
    return new Promise((resolve, reject) => {
      let where = {user:login.user, password: md5(login.password)};
      let gets = {
        fields: "*",
        table:  "staff",
        where:  where
      };
      db.SelectRow(connection, gets, 
      (data) => {
        let id = data.id;
        if(id != 0 || id != "0"){
          permission.writeToken(res, id);
          console.log(permission.readToken(req));
          $scope = data;
          resolve(data);
        }else{
          reject("Can't login");
        }
      },(error) => {
        console.log("Error is ", error);
        reject(error);
      });
    });
  };

  login_data()
  .then((data) => {
    res.json({
      status: true,
      data: {
        id: $scope.id, 
        display_name:$scope.name, 
        last_name: $scope.lastname,
        login_name: $scope.user, 
        password: $scope.password
      }
    });
  })
  .catch((error) => {
    res.json({
      status: false,
      error: error
    });
  });
  
});

module.exports = router;