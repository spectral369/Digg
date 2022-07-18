var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.loggedin) {

    res.render('bartender', { title: 'My Bartender' });
  } else {
    if(req.session){
    delete req.session.loggedin;
    delete req.session.hash;
    }
    res.writeHead(301, { Location: '/' });
    res.end();
  }


});

module.exports = router;