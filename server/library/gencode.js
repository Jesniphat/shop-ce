// let promise = require('bluebird');
const db = require('./db');

module.exports = new function() {
  this.Code = function(connection, table, fld, prefix, size, start, callback_success, callback_error){
    var where = " 1 = 1 ";
    if (prefix != '') {
        where += " AND `" + fld + "` LIKE '" + prefix + "%'";
    }
    var sql = {
      table: table,
      fields: "max(`" + fld + "`) as maxCode",
      where: where
    };
    var next = "";
    var maxCode = db.SelectRow(connection, sql, (result)=>{
      if(result.maxCode){
        console.log("Maxcode 18 = ", result.maxCode);
        next = parseInt((result.maxCode).substr(prefix.length)) + 1;
        console.log("20 => ", prefix + '0000000000000' + next);
        callback_success(prefix + (('0000000000000' + next).substr(-size)));
      }else{
        next = start + 0;
      }
    }, (error)=>{
      callback_error(error);
    });
  }
}