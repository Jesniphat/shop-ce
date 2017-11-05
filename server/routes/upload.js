let express = require('express');
let upload = express.Router();
let uuidv1 = require('uuid/v1');
let promise = require('bluebird');
const permission = require('../library/permission');
let conn = require('../library/config');
let db = require('../library/db');

let fs = require('fs');
// var path        = require('path');
// var bodyParser  = require('body-parser');
let moment = require('moment');
let multer = require('multer');
let uploadFile = multer({ dest: __dirname + '/tmp/' });
// console.log(uploadFile);

/* GET users listing. */
upload.post('/product', uploadFile.single('file'), function (req, res, next) {
  let $scope = {};
  let connection = conn.init();
  // console.log("res product pic = ", req.file);
  let save_file = function(){
    let deferred = promise.pending();
    let newName = moment().format('YYYY-MM-DD_hh-mm-ss') + '_' + req.file.originalname;
    // let filename = __dirname + '/../dist/public/images/product-img/' + newName;
    let filename = __dirname + './dist/public/images/product-img/' + newName;
    let src = fs.createReadStream(req.file.path);
    src.pipe(fs.createWriteStream(filename));
    src.on('end', function () {
      // res.send({
      //   status: true,
      //   fileName: newName
      // });
      $scope.newName = newName;
      deferred.resolve("Save file success");
    });
    src.on('error', function (err) {
      // res.send({
      //   status: false,
      //   exMessage: 'upload file error' + err
      // });
      deferred.reject(err);
    });
    return deferred.promise;
  }

  let insert_file_data = function(){
    let deferred = promise.pending();
    let pic = req.file;
    let data = {
      table: "product_pic",
      query: {
        productpic_name: $scope.newName,
        productpic_type: pic.mimetype,
        productpic_size: pic.size,
        productpic_path: "public/images/product-img/" + $scope.newName,
        uuid: uuidv1()
      }
    };

    db.Insert(connection, data, (results) => {
      $scope.pic_id = results.insert_id;
      deferred.resolve("Insert pic data success");
    }, (errors) => {
      console.log("error = ", errors);
      deferred.reject(errors);
    });
    return deferred.promise;
  }

  let get_pic = function(){
    let deferred = promise.pending();
    let query = {
      table: "product_pic",
      where: {
        id: $scope.pic_id
      }
    };
    db.SelectRow(connection,query, (results) => {
      $scope = {};
      $scope = results;
      deferred.resolve("Can get data");
    }, (errors) => {
      console.log("Can't get data = ", errors);
      deferred.reject(errors);
    });
    return deferred.promise;
  }

  save_file()
  .then(insert_file_data)
  .then(get_pic)
  .then(function(){
    res.json({
      status: true,
      data: $scope
    });
  }).catch(function(e){
    res.json({
      status: false,
      error: e
    });
  });
  
});


upload.post('/category', uploadFile.single('file'), function (req, res, next) {
  let $scope = {};
  let connection = conn.init();
  // console.log("res product pic = ", req.file);
  let save_file = function(){
    let deferred = promise.pending();
    let newName = moment().format('YYYY-MM-DD_hh-mm-ss') + '_' + req.file.originalname;
    let filename = __dirname + '/../dist/public/images/category-img/' + newName;
    let src = fs.createReadStream(req.file.path);
    src.pipe(fs.createWriteStream(filename));
    src.on('end', function () {
      // res.send({
      //   status: true,
      //   fileName: newName
      // });
      $scope.newName = newName;
      deferred.resolve("Save file success");
    });
    src.on('error', function (err) {
      // res.send({
      //   status: false,
      //   exMessage: 'upload file error' + err
      // });
      deferred.reject(err);
    });
    return deferred.promise;
  }


  save_file()
  .then(function(){
    res.json({
      status: true,
      data: {
        pic_name: $scope.newName,
        pic_path: "public/images/category-img/"  + $scope.newName
      }
    });
  }).catch(function(e){
    res.json({
      status: false,
      error: e
    });
  });
  
});

module.exports = upload;