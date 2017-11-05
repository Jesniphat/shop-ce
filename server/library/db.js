// let conn = require('./config');

module.exports = new function() {
  this.BeginTransaction = function(connection, success, errors){
    connection.beginTransaction(function(err) {
      if (err) {
        errors(err);
      } else {
        success("start transaction");
      }
    });
  }

  this.Commit = function(connection, success, errors){
    connection.commit(function(e){
      if (e) {
        errors(e);
      }else{
        // console.log("commit success");
        success("commit success");
      }
    });
  }

  this.Rollback = function(connection, roll){
    connection.rollback(function() {
     roll("rollback");
    });
  }

  this.SelectAll = function(connection, data, success, errors){
    var $scrope;
    // var select_data = function(){
    var fields = " * ";
    var where = " 1 = 1 ";
    var group = "";
    var order = "";
    var limit = "";

    if(typeof(data.where) == "object"){
      for(keys in data.where){
        where += " AND " + keys + " = '" + data.where[keys] + "'";
      }
    }else if (data.where != undefined){
      where += " AND " + data.where;
    }
    fields = (Array.isArray(data.fields)) ? (data.fields).toString() : (data.fields != undefined) ? data.fields : " * ";
    group  = (Array.isArray(data.group)) ? " GROUP BY " + (data.group).toString() : (data.group != undefined) ? " GROUP BY " + data.group : "";
    order  = (Array.isArray(data.order)) ? " ORDER BY " + (data.order).toString() : (data.order != undefined) ? " ORDER BY " + data.order : "";
    limit  = (data.limit != undefined) ? " LIMIT " + data.limit : "";

    var select = "SELECT " + fields + " FROM " + data.table + " WHERE " + where + group + order + limit;
    // console.log("select data = ", select);
    connection.query(select, function(error, results, fields){
      if(error){
        console.log("error : ", error);
        errors(error);
      }else if(results.length == 0) {
        console.log("Nodata => ", results);
        $scrope = results;
        success($scrope);
      }else {
        $scrope = results;
        success($scrope);
      }
    });
  }

  this.SelectRow = function(connection, data, success, errors){
    var $scrope;
    var fields = " * ";
    var where = " 1 = 1 ";
    var group = "";
    var order = "";
    var limit = "";
    
    if(typeof(data.where) == "object"){
      for(keys in data.where){
        where += " AND " + keys + " = '" + data.where[keys] + "'";
      }
    }else if (data.where != undefined){
      where += " AND " + data.where;
    }
    fields = (Array.isArray(data.fields)) ? (data.fields).toString() : (data.fields != undefined) ? data.fields : " * ";
    group  = (Array.isArray(data.group)) ? " GROUP BY " + (data.group).toString() : (data.group != undefined) ? " GROUP BY " + data.group : "";
    order  = (Array.isArray(data.order)) ? " ORDER BY " + (data.order).toString() : (data.order != undefined) ? " ORDER BY " + data.order : "";
    limit  = (data.limit != undefined) ? " LIMIT " + data.limit : "";

    var select = "SELECT " + fields + " FROM " + data.table + " WHERE " + where + order + limit;
    var select_row = connection.query(select, function(error, results, fields){
      // console.log("sql select row = ", select_row.sql);
      if(error){
        console.log("error : ", error);
        errors(error)
      }else if(results.length == 0) {
        console.log("Nodata => ", results);
        $scrope = results;
        success({});
      }else {
        $scrope = results;
        success($scrope[0]);
      }
    });
  }

  this.Insert = function(connection, data, success, errors){
    var $scrope;
    if(typeof(data) == "object"){
      
    } else {
      errors("Is not object");
      return;
    }

    var insert = "INSERT INTO " + data.table + " SET ? ";
    var querys = connection.query(insert, data.query, function(error, results, fields) {
      // console.log(querys.sql);
      if (error) {
        errors(error);
      } else {
        $scrope = {insert_id:results.insertId, effected_row:results.affectedRows, change_row:results.changedRows };
        // console.log("INSERT SUCCESS = ", $scrope);
        success($scrope);
      }
    });
  }

  this.Update = function(connection, data, success, errors){
    var $scrope;
    var fields = [];
    var set = [];
    var where = " WHERE 1 = 1 "; 
    for(keys in data.query){
      fields.push(keys + " = ?");
      set.push(data.query[keys]);
    }
    fields.toString();

    if(typeof(data.where) == "object"){
      for(keys in data.where){
        where += " AND " + keys + " = ?";
        set.push(data.where[keys]);
      }
    }else if (data.where != undefined){
      where += " AND " + data.where;
    }
    var update = "UPDATE " + data.table + " SET " + fields + where;
    var querys = connection.query(update, set, function(error, results, fields) {
      // console.log("Update is ", querys.sql);
      if (error) {
        errors(error)
      } else {
        $scrope = { effected_row:results.affectedRows, change_row:results.changedRows };
        success($scrope);
      }
    });
  }

  this.Delete = function(connection, data, success, errors){
    var $scrope;
    var where = " WHERE 1 = 1 ";
    if(typeof(data.where) == "object"){
      for(keys in data.where){
        where += " AND " + keys + " = '" + data.where[keys] + "'";
      }
    }else if (data.where != undefined){
      where += " AND " + data.where;
    }else{
      errors("You can't delete data by this query");
    }
    var query = "DELETE FROM " + data.table + where;
    
    connection.query(query, function(error, results, fields) {
      if (error) {
        console.log("Error : ", error);
        errors(error);
      }
      $scrope = { effected_row:results.affectedRows, change_row:results.changedRows };
      success($scrope);
    });
  }

}