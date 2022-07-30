var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.loggedin && req.session.token) {

    res.render('bartender', { title: 'My Bartender' });
  } else {
    
    req.session.destroy(function(err) {
      if(err) {
          return next(err);
      } else {
          req.session = null;
          console.log("reset");
          return  res.render('index', { title: 'Digg Dolma', loggedin:req.session.loggedin });
      }
  });
    /*res.writeHead(301, { Location: '/' });
    res.end();*/
  }


});

module.exports = router;