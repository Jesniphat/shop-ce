let express = require('express');
let router = express.Router();

let Promise = require('bluebird');
let uuidv1 = require('uuid/v1');
const permission = require('../library/permission');
let conn = require('../library/config');
let gencode = require('../library/gencode')
let db = require('../library/db');

/**
 * Use functiion
 * 
 * @access public
 * @param callback function req res next
 * @return JSON
 */
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


/**
 * product list
 * 
 * @access public
 * @param callback function req res next
 * @return JSON
 */
router.post("/product_list",(req, res, next) => {
  let connection = conn.init();
  let product = req.body;
  let $scope;

  let product_list = function(){
    return new Promise((resolve, reject) => {
      let gets = {
        fields: [
          "p.*",
          "max(pp.productpic_path) as img"
        ],
        table: "product p left join product_pic pp on p.id = pp.product_id and pp.cover = 'Y'",
        where: {
          "p.status" : "Y"
        },
        group: "p.id"
      }
      db.SelectAll(connection, gets, (data) => {
          resolve(data);
        }, (error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  product_list()
  .then(($data) => {
    res.json({
      status: true,
      data: $data
    });
  })
  .catch(($error) => {
    res.json({
      status: false,
      error: $error
    });
  });
    
});


/**
 * Get product by id
 * 
 * @access public
 * @param callbackfucnt(@pruduct id)
 * @return JSON
 */
router.post("/getproductbyid", (req, res, next) => {
  let connection = conn.init();
  let product = req.body;
  let $scope;
  let product_data = {};

  let get_product = function($id){
    return new Promise((resolve, reject) => {
      let get = {
        table: "product",
        where: {
          id: $id
        }
      };
      db.SelectRow(connection, get, (data) => {
        product_data = data;
        resolve(data.id);
      },(error) => {
        console.log(error);
        reject("error");
      });
    });
  }

  let get_product_pic = function($data){
    // console.log("$data = ", $data);
    return new Promise((resolve, reject) => {
      let gets = {
        table: "product_pic",
        where: {
          product_id: $data,
          status: "Y"
        }
      }
      db.SelectAll(connection, gets, (data) => {
        product_data.pic = data;
        resolve("success");
      },(error) => {
        if(error == "nodata"){
          resolve("success");
        } else {
          reject(error);
        }
      });
    });
    
  }

    get_product(product.product_id)
    .then(get_product_pic)
    .then(function($d){
      res.json({
        status: true,
        data: product_data
      });
    }).catch(function($e){
      res.json({
        status: false,
        error: $e
      });
    });
    
  }
);


/**
 * Save product
 * 
 * @access public
 * @param {product object}
 * @return JSON
 */
router.post("/saveproduct", (req, res, next) => {
  let connection = conn.init();
  console.log("save product = ", req.body);
  let product = req.body;
  let product_id = "";
  let product_code = "";

  /**Begin transection */
  let beginTransection = function(){
    return new Promise((resolve, reject) => {
      db.BeginTransaction(connection, success => resolve(success), errors => reject(errors));
    });
  }

  /**
   * Save product 
   * 
   * @return product id and error
   */
  let saveProduct = function(){
    return new Promise((resolve, reject) => {
      if(product.id == "create"){
        gencode.Code(connection, "product", "code", "P", 5, 1,(max_code) => {
          product_code = max_code;
          let insert = {
            table: "product",
            query: {
              code: product_code,
              product_name: product.name,
              product_description: product.desc,
              product_price: product.price,
              product_cost: product.cost,
              created_by: product.staffid,
              category_id: product.category,
              uuid: uuidv1()
            }
          }
          let insertProduct = db.Insert(connection, insert, results => resolve(results.insert_id), errors => reject(errors));
        },(error) => {
          reject(error);
        });
      } else {
        let update = {
          table: "product",
          query: {
            product_name: product.name,
              product_description: product.desc,
              product_price: product.price,
              product_cost: product.cost,
              created_by: product.staffid,
              category_id: product.category
          },
          where: { id: product.id }
        }
        let updateProduct = db.Update(connection, update, results => resolve(product.id), error => reject(error));
      }
    });
  }

  /**
   * Manage product picture
   * 
   * @param product id
   * @return product id and error
   */
  let picManage = function(product_id) {
    return new Promise((resolve, reject) => {
      if((product.pic_id).length > 0){
        let update = {
          table: 'product_pic',
          query: { status: 'N' },
          where: { product_id: product_id }
        }
        let nPic = db.Update(connection, update, (success) => {
          let updatePic = {
            table: 'product_pic',
            query: { product_id: product_id, status: 'Y' },
            where: " id IN (" + (product.pic_id).toString() + ")"
          }
          let aPic = db.Update(connection, updatePic, success => resolve(product_id), errors => reject(errors));
        }, errors => reject(errors));
      } else {
        let update = {
          table: 'product_pic',
          query: {
            status: 'N',
            cover: 'N'
          },
          where: { product_id: product_id }
        }
        let updatePicData = db.Update(connection, update, success => resolve(product_id), errors => reject(errors));
      }
    });
  }

  /**
   * Reccommend
   * 
   * @param {*} product_id 
   * @return product_id and error
   */
  let recommendProduct = function(product_id) {
    return new Promise((resolve, reject) => {
      if(product.recommend == true){
        let query = {
          table: "product",
          fields: ['id'],
          where: { recommend: 'Y' },
          order: ['rec_row']
        }
        db.SelectAll(connection, query, (success) => {
          let recommend_list = [];
          let recs = [];
          success.forEach((value, index) => {
            recs.push(value);
          });
          let checkId = recs.indexOf(product_id);
          success.forEach((value, index)=> {
            if(index == 0 && success.length == 3 && checkId == (-1)){
              return;
            }
            recommend_list.push(value.id);
          });
          recommend_list.push(product_id);
          let updateNRecomment = {
            table: "product",
            query: { recommend: "N" },
            where: { recommend: "Y" }
          }
          db.Update(connection, updateNRecomment, (success) => {
            recommend_list.forEach((value, index) => {
              let updateRecomment = {
                table: "product",
                query: { recommend: "Y", rec_row: index },
                where: { id: value }
              }
              db.Update(connection, updateRecomment, success => resolve(product_id), er => reject(er));
            });
          }, err => reject(err));
        }, errers => reject(errors));
      } else {
        let updateRecomment = {
          table: "product",
          query: { recommend: "N", rec_row: "0" },
          where: { id: product_id }
        }
        db.Update(connection, updateRecomment, success => resolve(product_id), errors => reject(errors));
      }
    });
  }


  /**
   * Set cover pic
   * 
   * @param {*} product_id
   * @return product_id and error
   */
  let setCover = function(product_id){
    console.log("set cover");
    return new Promise((resolve, reject) => {
      if(product.coverId != '0'){
        let updateNCover = {
          table: "product_pic",
          query: { cover: "N"},
          where: { product_id: product_id }
        }
        db.Update(connection, updateNCover, (success) => {
          let updateCover = {
            table: "product_pic",
            query: { cover: "Y" },
            where: { id: product.coverId }
          }
          db.Update(connection, updateCover, success => resolve(product_id), error => reject(error));
        }, errors => reject(errors));
      } else {
        resolve(product_id);
      }
    });
  }

  beginTransection()
  .then(saveProduct)
  .then(picManage)
  .then(recommendProduct)
  .then(setCover)
  .then((product_id) => {
    return new Promise((resolve, reject) => {
      console.log("commit");
      db.Commit(connection, (success) => {
        console.log("commited !!");
				res.json({
					status: true,
					data: success
				});
        resolve(success);
      }, errors => reject(errors));
    });
  }).catch((errors) => {
    console.log("Roll back error is", errors);
		db.Rollback(connection,(roll) => {
			res.json({
				status: false,
				error: errors
			});
		});
  });
  
});


/**
 * Delete product
 * 
 * @access publict
 * @param product id
 * @return JSON
 */
router.post("/delete_product",(req, res, next) => {
  let product = req.body;
  let connection = conn.init();
  
  /**
   * Begintranseccion
   */
  let beginTransection = function(){
    return new Promise((resolve, reject) => {
      db.BeginTransaction(connection, success => resolve(success), errors => reject(errors));
    });
  }


  /**
   * Delete product
   * 
   * @return void
   */
  let deleteProd = function(){
    return new Promise((resolve, reject) => {
      let updateDelete = {
        table: "product",
        query: { status: "N" },
        where: { id: product.id }
      }
      let up = db.Update(connection, updateDelete, success => resolve(success), error => reject(error));
    });
  }


  /**
   * Blue bird start
   * 
   * @return JSON
   */
  beginTransection()
  .then(deleteProd)
  .then(function(){
    return new Promise((resolve, reject) => {
      console.log("commit");
      db.Commit(connection, (success) => {
        console.log("commited !!");
				res.json({
					status: true,
					data: success
				});
        resolve(success);
      }, errors => reject(errors));
    });
  }).catch((errors) => {
    console.log("Roll back error is", errors);
		db.Rollback(connection,(roll) => {
			res.json({
				status: false,
				error: errors
			});
		});
  });
});


/**
 * Get producname for autocomplete
 * 
 * @access function
 * @param max_id
 * @return JSON
 */
router.post("/getAllProductStore",(req, res, next) => {
  let max_update = req.body.max_update;
  let connection = conn.init();

  /**
   * Get data function
   * 
   * @access public
   * @return promist
   */
  let getProductName = function(){
    return new Promise((resolve, reject) => {
      let get = {
        fields: [
          "id, code, product_name as name, product_description, DATE_FORMAT(updated_date, '%Y-%m-%d %H:%i:%s') as updated_date"
        ],
        table: "product",
        where: "status = 'Y' and updated_date > " + "date_format('" + max_update + "', '%Y-%m-%d %H:%i:%s')",
        order: ['updated_date']
      };
      
      db.SelectAll(connection, get, (data) => {
        resolve(data);
      },(error) => {
        if(error == 'nodata'){
          resolve([]);
        }else{
          console.log(error);
          reject(error);
        }
      });
    });
  }


  /**
   * Blue bird start
   * 
   * @return JSON
   */
  getProductName()
  .then(function(data){
    // console.log(data);
    res.json({
      status: true,
      data: data
    });
  }).catch((errors) => {
    console.log("Roll back error is", errors);
    res.json({
      status: false,
      error: errors
    });
  });

});


/**
 * MaxProductId
 * 
 * @return JSON
 */
router.post("/maxProductUpdate", (req, res, next) => {
  let connection = conn.init();

  /**
   * Get product max id
   * 
   * @access public
   * @return Promise
   */
  let getProductMaxId = function(){
    return new Promise((resolve, reject) => {
      let get = {
        fields: [
          "MAX(DATE_FORMAT(updated_date, '%Y-%m-%d %H:%i:%s')) AS max"
        ],
        table: "product",
        where: "status = 'Y'"
      };
      db.SelectAll(connection, get, (data) => {
        resolve(data);
      },(error) => {
        console.log(error);
        reject("error");
      });
    });
  }

  getProductMaxId()
  .then((data) => {
    // console.log(data[0].max);
    res.json({
      status: true,
      data: data[0].max
    });
  })
  .catch((error) => {
    console.log("error => ", error);
    res.json({
      status: false,
      error: error
    });
  });
});


/**
 * Save stock in
 */
router.post('/saveStockIn', (req, res, next) => {
  let connection = conn.init();
  let stock = req.body;

  /**Begin transection */
  let beginTransection = function(){
    return new Promise((resolve, reject) => {
      db.BeginTransaction(connection, success => resolve(success), errors => reject(errors));
    });
  }


  /** Save stock */
  let saveStock = function(){
    return new Promise((resolve, reject) => {
      let insert = {
        table: "lot_in",
        query: {
          product_id: stock.product_id,
          // product_code: stock.product_code,
          lot_in: stock.product_qty,
          uuid: uuidv1()
        }
      }
      let insertStock = db.Insert(
        connection, insert, 
        results => resolve(results.insert_id), 
        errors => reject(errors));
    });
  }

  beginTransection()
  .then(saveStock)
  .then((stock_id) => {
    return new Promise((resolve, reject) => {
      console.log("commit");
      db.Commit(connection, (success) => {
        console.log("commited !!");
				res.json({
					status: true,
					data: success
				});
        resolve(success);
      }, errors => reject(errors));
    });
  }).catch((errors) => {
    console.log("Roll back error is", errors);
		db.Rollback(connection, (roll) => {
			res.json({
				status: false,
				error: errors
			});
		});
  })

});


router.post("/getStockList", (req, res, next) => {
  let connection = conn.init();
  let stock = req.body;

  /** Get data of stock */
  let getStockById = function(){
    return new Promise((resolve, reject) => {
      let get = {
        fields: [
          "s.lot_in",
          "s.created_at",
          "p.code",
          "p.product_name",
          "p.product_price"
        ],
        table: "lot_in s inner join product p on s.product_id = p.id",
        where: {'p.status': 'Y', 's.product_id': stock.product_id}
      };
      db.SelectAll(connection, get, (data) => {
        resolve(data);
      },(error) => {
        console.log(error);
        reject("error");
      });
    });
  }

  getStockById()
  .then((data) => {
    // console.log(data[0].max);
    res.json({
      status: true,
      data: data
    });
  })
  .catch((error) => {
    console.log("error => ", error);
    res.json({
      status: false,
      error: error
    });
  });

});

module.exports = router;