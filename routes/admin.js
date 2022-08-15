var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session.loggedin && req.session.token && req.session.rank == 2) {

    res.render('admin', { title: 'Digg Dolma Admin page', rank:req.session.rank });
  } else {
    
    req.session.destroy(function(err) {
      if(err) {
          return next(err);
      } else {
          req.session = null;
          console.log("reset");
          return  res.render('index', { title: 'Digg Dolma' });
      }
  });
  }
  
  });
  
  module.exports = router;