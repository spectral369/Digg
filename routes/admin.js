var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session.loggedin && req.session.token && req.session.rank == 2) {
  
      res.render('admin', { title: 'My Bartender admin page' });
    } else {
      
    
     res.end("You need more privileges !");
    }
  
  
  });
  
  module.exports = router;