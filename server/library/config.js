module.exports = new function() {
  var db = null;
  this.init = function(){
    var mysql = require("mysql");
    db = mysql.createConnection({
      host: "13.59.164.106",
      port: 3306,
      user: "root",
      password: "rootp@ssw0rd",
      database: "project_jphp"
    });
    db.connect(function(err){
      if(err) {
        console.log("Error Connect db");
        console.log(err);
      }else {
        // console.log("Connect DB Success");
      }
    });
    return db;
  }
}