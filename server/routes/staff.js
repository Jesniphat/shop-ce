let express = require('express');
let router = express.Router();

let Promise = require('bluebird');
let uuidv1 = require('uuid/v1');
const permission = require('../library/permission');
let conn = require('../library/config');
let db = require('../library/db');

router.use(function (req, res, next) {
  // console.log("perrmission : ", permission.readToken(req));
  if (permission.isLogin(req)) {
    next();
  } else {
    res.json({
      status: true,
      nologin: true,
      error: "Access Denied"
    });
  }
});

router.post("/createstaff", (req, res, next) => {
  let con = conn.init();
  let staff = req.body;

  let beginTransection = function(){
    return new Promise((resolve, reject) => {
      db.BeginTransaction(con, success => resolve(success), errors => reject(errors));
    });
  }

  let insertStaff = function(){
    return new Promise((resolve, reject) => {
      let insertData = {
        table: "staff",
        query: {
          name: staff.staffName,
          lastname: staff.staffLastName,
          user: staff.staffUserName,
          password: staff.staffPassword,
          uuid: uuidv1()
        }
      };
      let insertThings = db.Insert(con, insertData, success => resolve(success), error => reject(error));
    });
  }

  beginTransection()
  .then(insertStaff)
  .then((data) => {
    console.log("commit");
    let commit = db.Commit(con,(success) => {
      res.json({
        status: true,
        data: data
      });
    }, error => reject(error));
  }).catch((error) =>{
    res.json({
      status: false,
      error: error
    });
  });
});

router.post("/updatestaff", (req, res, next) => {
  let con = conn.init();
  let staff = req.body;

  let beginTransection = function(){
    return new Promise((resolve, reject) => {
      db.BeginTransaction(con, success => resolve(success), errors => reject(errors));
    });
  }

  let updataStaff = function(){
    return new Promise((resolve, reject) => {
      let updataStaffdata = {
        table: "staff",
        query: {
          name: staff.name,
          lastname: staff.lastName,
          user: staff.user
        },
        where: { id: staff.id }
      }
      let update = db.Update(con, updataStaffdata, success => resolve(success), error => reject(error));
    });
  }

  beginTransection()
  .then(updataStaff)
  .then((result) => {
    console.log("uo");
    return new Promise((resolve, reject) => {
      db.Commit(con, (success) => {
        res.json({
          status: true,
          data: result
        });
      }, error => reject(error));
    });
  }).catch((error) => {
    res.json({
      status: false,
      data: error
    });
  });

});

module.exports = router;