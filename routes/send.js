var express = require('express');
var router = express.Router();
const edgedb = require("edgedb");
const CryptoJS = require("crypto-js");
const nodemailer = require('nodemailer');
var path = require('path');
var fs = require('fs');
const e = require('express');
const { exit } = require('process');



const configPath = path.join(__dirname, '../db.config');
var client;

fs.readFile(configPath, 'utf8', function (err, data) {
  if (err) {
    fs.writeFile(configPath, 'DB info required here line by line separeted with ":" ', function (err) {
      if (err) return console.log(err);
      console.log('DB config missing, edit db.config');
      exit(1)
    });
  }

  const lines = data.split(/\r?\n/);
  var line_info = { host: '', port: 0, user: '', password: '', tlsSecurity: '' };
  lines.forEach((line) => {

    if (line.length > 1) {

      var info_all = line.split(":");
      switch (info_all[0]) {
        case 'host': {
          line_info.host = info_all[1];
          break;
        }
        case 'port': {
          line_info.port = parseInt(info_all[1]);
          break;
        }
        case 'user': {
          line_info.user = info_all[1];
          break;
        }
        case 'password': {
          line_info.password = info_all[1];
          break;
        }
        case 'tlsSecurity': {
          line_info.tlsSecurity = info_all[1];
          break;
        }
        default: {
          console.log("db.config invalid!");
          exit(2);
        }
      }
    }
  });
  client = edgedb.createClient({
    host: line_info.host,
    port: line_info.port,
    user: line_info.user,
    password: line_info.password,
    // "database": "edgedb",
    tlsSecurity: line_info.tlsSecurity,
  });

});


/*const client = edgedb.createClient({
  host: '',
  port: ,
  user: '',
  password: '',
  // "database": "",
  tlsSecurity: '',
});*/

router.post('/register', function (req, res, next) {

  var encrypted = CryptoJS.AES.encrypt(req.body.password, process.env.USER);
  var hash_pre = req.body.namefull.concat(generateRandomString(10));
  var hash = CryptoJS.HmacSHA3(hash_pre, process.env.USER);

  let query = `INSERT user { username:= "` + req.body.username + `", namefull:= "` + req.body.namefull + `", password:= "` + encrypted.toString() + `", registration_date:=datetime_of_statement(), hash:="` + hash + `"};`;
  console.log(query);
  run(query).then(function (resp) {

    if (resp.indexOf('id')) {
      res.send("Registration was a success");

    } else {
      res.status(400).send("Registration failed")
    }
  });

});


router.post('/login', function (req, res, next) {

  let username = req.body.username;
  let password = req.body.password;
  let query = `select user {password,hash,rank} filter user.username ="` + username + `";`;

  run(query).then(function (resp) {

    if (resp.length > 0) {
      var decrypted = CryptoJS.AES.decrypt(resp[0].password, process.env.USER);
      if (password === decrypted.toString(CryptoJS.enc.Utf8)) {
        if (resp[0].rank > 0) {
          req.session.loggedin = true;
          req.session.rank = resp[0].rank;
          req.session.token = resp[0].hash;
          req.session.save();
          res.send("Login Successfull !");
        } else {
          res.send("Login Successful, but no rights given ! Please contact the administrator!");
        }
      } else {
        req.session.loggedin = false;
        res.send("Login Failed !");
      }
    } else {
      res.send("Login Failed !");
    }
  });


});


router.post('/insertorder', function (req, res, next) {

  var queryBuilder = [];
  queryBuilder.push(`insert order {
	order_time:=datetime_of_statement(),
	user:= (select user filter .hash ="`+ req.session.token + `"),
	beverage:= {`);
  queryBuilder.push(req.body.beverages);

  queryBuilder.push(`}};`);
  run(queryBuilder.join("")).then(function (resp) {
    if (resp) {
      res.send("Comanda procesata");
    } else {
      res.send("error...");
    }
  });


});



router.post('/ordercountuser', function (req, res, next) {

  let query = `with result := (select order{ beverage } filter order.user.hash="` + req.session.token + `") select count(result);`;
  run(query).then(function (resp) {
    if (resp) {
      res.send(resp);
      res.end();
    } else {
      res.send("N/A");
      res.end();
    }
  });


});


router.post('/ordercount', function (req, res, next) {
  let query = `select count(order);`;
  run(query).then(function (resp) {
    if (resp) {
      res.send(resp);
      res.end();
    } else {
      res.send("N/A");
      res.end();
    }
  });
});

router.post('/usercount', function (req, res, next) {
  let query = `with result := (select user{ id } filter .rank>0) select count(result);`;
  run(query).then(function (resp) {
    if (resp) {
      res.send(resp);
      res.end();
    } else {
      res.send("N/A");
      res.end();
    }
  });
});




router.post('/partydates', function (req, res, next) {
  let query = `with result := (select order.order_time ) select distinct (datetime_get(result,'month'), datetime_get(result,'year'));`;
  run(query).then(function (resp) {
    if (resp) {
      res.send(resp);
      res.end();
    } else {
      res.send("N/A");
      res.end();
    }
  });
});

router.post('/getimagelist', function (req, res, next) {

  var directoryPath = path.join(__dirname, '../public/images/carousel');
  var obj = [];
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }


    var filePath = path.join(__dirname, '../carousel_active_images.txt');

    var img_line = fs.readFileSync(filePath, 'utf8');
    const lines = img_line.split(/\r?\n/);

    var line_img = [];
    var is_empty = true;
    lines.forEach((line) => {
      if (line.length < 1) {
        is_empty = true;
      } else {
        is_empty = false;
        line_img.push(line);
      }

    });

    files.forEach(function (file) {
      let x = new Object();
      if (!is_empty) {
        for (var i = 0; i < line_img.length; i++) {
          if (line_img[i].length < 1)
            break;

          if (file.includes(line_img[i])) {
            x.src = file;
            x.active = true;

            break;
          }
          else {

            x.src = file;
            x.active = false;

          }

        }
      } else {
        x.src = file;
        x.active = false;
      }
      obj.push(x);
    });
    res.send(obj);

  });
});


router.post('/addcarouselimg', function (req, res, next) {

  var filePath = path.join(__dirname, '../carousel_active_images.txt');

  fs.appendFileSync(filePath, "\n" + req.body.item);

  res.send("done");

});

router.post('/removecarouselimg', function (req, res, next) {

  var filePath = path.join(__dirname, '../carousel_active_images.txt');

  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    var lines = data.split(/\r?\n/);
    var to_be_written = '';
    var y = 0;
    lines.forEach((line) => {
      if (line.includes(req.body.item)) {

      } else {
        to_be_written += line + "\n";
      }

      y++;
    });
    to_be_written = to_be_written.substring(0, to_be_written.length - 1);
    console.log(to_be_written);
    fs.writeFileSync(filePath, to_be_written);

  });

  res.send("done");

});



router.post('/getcarouselactive', function (req, res, next) {

  var filePath = path.join(__dirname, '../carousel_active_images.txt');

  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    const lines = data.split(/\r?\n/);

    var line_img = [];
    lines.forEach((line) => {
      if (line.length > 1)
        line_img.push(line);
    });

    res.send(line_img);
  });
});



router.post('/uploadcarouselimg', function (req, res, next) {


  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let sampleFile = req.files.file;

  sampleFile.mv(path.join(__dirname + '/../public/', 'images/carousel/') + sampleFile.name, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    res.send('File uploaded!');
  });
});


router.post('/deletecarouselimgs', function (req, res, next) {


  var directoryPath = path.join(__dirname, '../public/images/carousel');
  var obj = [];
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }

    var filePath = path.join(__dirname, '../carousel_active_images.txt');

    var img_line = fs.readFileSync(filePath, 'utf8');
    const lines = img_line.split(/\r?\n/);

    var line_img = [];
    var is_empty = true;
    lines.forEach((line) => {
      if (line.length < 1) {
        is_empty = true;
      } else {
        is_empty = false;
        line_img.push(line);
      }

    });
    var directoryPath = path.join(__dirname, '../public/images/carousel/');
    files.forEach(function (file) {
      var is_present = false;
      if (!is_empty) {
        for (var i = 0; i < line_img.length; i++) {
          if (line_img[i].length < 1)
            break;

          if (file.includes(line_img[i])) {
            is_present = true;
          }
        }
      } else {
        console.log("Please reset 'carousel_active_images.txt'!")

      }
      if (!is_present)
        fs.unlinkSync(directoryPath + file);
    });

  });

  res.send("done");

});


router.post('/sendmail', function (req, res, next) {
  let name = req.body.name;
  let email = req.body.email;
  let message = req.body.message;

  let transporter = nodemailer.createTransport({
    service: 'postfix',
    host: '127.0.0.1',
    secure: false,
    port: 25,
    //auth: { user: 'yourlinuxusername@edison.example.com', pass: 'yourlinuxuserpassword' },
    tls: { rejectUnauthorized: false }
  });

  let mailOptions = {
    from: 'admin@diggdolma.com',
    to: 'admin@diggdolma.com',
    subject: 'Mail from ' + name,
    text: `" ${message} \n User E-Mail: ${email}"`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.end("E-Mail send failed!")
    } else {
      console.log(info);
      res.end("E-Mail send success !")
    }
  });

});


async function run(query) {
  const result = await client.query(query)
  return result;
}

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
