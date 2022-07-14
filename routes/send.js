var express = require('express');
var router = express.Router();
const edgedb = require("edgedb");
const CryptoJS = require("crypto-js");

///asta trebuie pusa in db.config  TODO !!!!!!!!!!! si pusa in  .gitignore !
const client = edgedb.createClient({
  host: 'localhost',
  port: 10707,
  user: 'edgedb',
  password: 'YrgbGsOMVfU6yd4ndqpJxtXo',
  // "database": "edgedb",
  tlsSecurity: 'insecure',
});

/*
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});*/



router.post('/register', function (req, res, next) {



  var encrypted = CryptoJS.AES.encrypt(req.body.password, process.env.USER);

  var hash_pre =  req.body.namefull.concat(generateRandomString(10));
  var  hash =  CryptoJS.HmacSHA3(hash_pre,process.env.USER);

  let query = `INSERT user { username:= "` + req.body.username + `", namefull:= "` + req.body.namefull+ `", password:= "` + encrypted.toString() + `", registration_date:=datetime_of_statement(), hash:="` + hash + `"};`;
  console.log(query);
  run(query).then(function (resp) {

    if (resp.indexOf('id')) {
      res.send("Registration was a success");
     
    } else {
      res.status(400).send("Registration failed")
     // res.end();
    }
  });
  
});


router.post('/login', function (req, res, next) {

  let username =  req.body.username;
  let password =  req.body.password;
  
  let query =  `select user {password,hash} filter user.username ="`+username+`";`;

run(query).then(function(resp){
 

  if(resp){
    var decrypted = CryptoJS.AES.decrypt(resp[0].password, process.env.USER);
    if(password === decrypted.toString(CryptoJS.enc.Utf8)){
      console.log("password is the same !");
      req.session.loggedin = true; 
      req.session.token = resp[0].hash; 
      req.session.save();
      res.send("Login Successfull !");
    }else{
      res.send("Login Failed !");
    }
  }
});


});


router.post('/insertorder', function (req, res, next) {


//console.log(req.body);

var queryBuilder = [];
queryBuilder.push(`insert order {
	order_time:=datetime_of_statement(),
	user:= (select user filter .hash ="`+req.session.token+`"),
	beverage:= {`);
queryBuilder.push(req.body.beverages);

  queryBuilder.push(`}};`);

  //console.log(queryBuilder.join(""));
  run(queryBuilder.join("")).then(function(resp){
      if(resp){
        res.send("Comanda procesata");
      }else{
        res.send("error...");
      }
  });


});



router.post('/ordercount', function (req, res, next) {

  let query = `select count(order.id);`;


  run(query).then(function(resp){
    if(resp){
      res.send(resp);
      res.end();
    }else{
      res.send("N/A");
      res.end();
    }
  });


});


async function run(query) {
  const result = await client.query(query)
  return result;
}


// Create a function for reusable perpose
const generateRandomString = (myLength) => {
  const chars =
    "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
  const randomArray = Array.from(
    { length: myLength },
    (v, k) => chars[Math.floor(Math.random() * chars.length)]
  );

  const randomString = randomArray.join("");
  return randomString;
};

module.exports = router;
