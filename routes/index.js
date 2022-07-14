var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("bartender session hash: "+req.session.hash);

  res.render('index', { title: 'Express', loggedin:req.session.loggedin });
});

module.exports = router;
