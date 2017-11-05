const express = require('express');
const router = express.Router();
const promise = require('bluebird');
const conn = require('../library/config');
const permission = require('../library/permission');
const db = require('../library/db');


router.use(function(req, res, next){
  // console.log("perrmission : ", permission.readToken(req));
  if(permission.isLogin(req)){
    next();
  }else {
    res.json({
      status:true,
      nologin: true,
      error: "Access Denied"
    });
  }
});

router.post("/ping", function(req, res, next){
  res.json({
      status:true,
      data:'1'
    });
});

router.post('/menulist', (req, res, next) => {
  let connection = conn.init();
	let param = req.body;
	let $scope;
	
	let menu_list = function(){
		return new promise((resolve, reject) => {
			let gets = {
				fields: " * ",
				table: "menu",
				where: {
          page: param.page
				}
			}
			db.SelectAll(connection, gets, (data) => {
					$scope = data;
					resolve(data);
				},(error) => {
					console.log(error);
					reject(error);
			});
		});
	}

	menu_list()
	.then(function(data){
		res.json({
			status: true,
			data: data
		});
	})
	.catch(function(error){
		res.json({
			status: false,
			error: error
		});
  });
  
});

module.exports = router;
