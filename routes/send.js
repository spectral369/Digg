var express = require('express');
var router = express.Router();
const edgedb = require("edgedb");
const CryptoJS = require("crypto-js");
const nodemailer = require('nodemailer');
var path = require('path');
var fs = require('fs');
const e = require('express');
const { exit } = require('process');
var PdfPrinter = require('pdfmake');
var fonts = {
  Courier: {
    normal: 'Courier',
    bold: 'Courier-Bold',
    italics: 'Courier-Oblique',
    bolditalics: 'Courier-BoldOblique'
  },
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  },
  Times: {
    normal: 'Times-Roman',
    bold: 'Times-Bold',
    italics: 'Times-Italic',
    bolditalics: 'Times-BoldItalic'
  },
  Symbol: {
    normal: 'Symbol'
  },
  ZapfDingbats: {
    normal: 'ZapfDingbats'
  }
};
var printer = new PdfPrinter(fonts);



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
  //let query = `select count(order);`;

  let query = `with result2 := (select user { hash } filter '` + req.session.token + `' in .hash)
	select count(order) if result2.hash = '`+ req.session.token + `' else -1;`;

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
  // let query = `with result := (select user{ id } filter .rank>0) select count(result);`;

  let query = `with result := (select user { id } filter .rank>0),
	result2 := (select user { hash } filter '`+ req.session.token + `' in .hash)
	select count(result) if result2.hash = '`+ req.session.token + `' else -1;`
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
  let query = `with result := (select order.order_time ) select distinct (datetime_get(result,'year'), datetime_get(result,'month'));`;
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



router.post('/getinfomessage', function (req, res, next) {
  var filePath = path.join(__dirname, '../message.txt');
  var message_lines = fs.readFileSync(filePath, 'utf8');
  const lines = message_lines.split(/\r?\n/);

  var message_data = [];
  var is_empty = true;
  lines.forEach((line) => {
    if (line.length < 1) {
      is_empty = true;
    } else {
      is_empty = false;
      message_data.push(line);
    }
  });

  if (!is_empty) {
    var message_text = message_data[0].split(":");

    var date1 = message_data[1].split(":");
    var date_now = new Date();
    var date_init = new Date(date1[1]);

    timeDifference = date_init.getTime() - date_now.getTime();

    var return_data = { message: message_text[1], time: timeDifference.toString() }
    res.send(return_data);
  } else {
    res.send("No Message");
  }

});

router.post('/setinfomessage', function (req, res, next) {

  var filePath = path.join(__dirname, '../message.txt');
  var message_lines = fs.readFileSync(filePath, 'utf8');
  const lines = message_lines.split(/\r?\n/);

  var message_data = [];
  var is_empty = true;
  lines.forEach((line) => {
    if (line.length < 1) {
      is_empty = true;
    } else {
      is_empty = false;
      message_data.push(line);
    }
  });

  var message_new_data = message_data[0].substring(0, message_data[0].indexOf(":") + 1);
  message_new_data += req.body.message;
  message_new_data += '\n';
  message_new_data += message_data[1].substring(0, message_data[1].indexOf(":") + 1);
  message_new_data += req.body.date;


  console.log(message_new_data);
  fs.writeFileSync(filePath, message_new_data, 'utf-8');
  res.send("Done !")
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

router.post('/ordersbydate', function (req, res, next) {

  let date = req.body.date.replace('/', '-');
  let month = date.substr(date.indexOf('/'), date.length);

  if (month.length == 1) {
    month = '0' + month;
  }
  date = date.substr(0, date.indexOf('-') + 1) + month;
  let query = `select order{ user_id,user:{username}, beverage:{name,price,quantity}} filter to_str(datetime_truncate(.order_time, "months")) like '${date}%';`;
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

router.post('/generatePDF', function (req, res, next) {

  let query = `select order{ user_id,order_time,user:{username}, beverage:{name,price,quantity}} filter .user_id=${req.body.id};`;//
  //console.log(query);
  run(query).then(function (resp) {
    if (resp) {
      var order_id = resp[0].user_id;
      var order_time = resp[0].order_time;
      var beverages = resp[0].beverage;

      var content_bev = [[{ text: 'Produs', style: 'tableHeader' }, { text: 'Count', style: 'tableHeader2' }, { text: 'Pret', style: 'tableHeader3' }]];
      var price_total = 0;

      beverages.forEach((beverage) => {
        content_bev.push([{ text: beverage.name, style: 'columnitem1' }, { text: beverage.quantity, style: 'columnitem2' }, { text: beverage.price, style: 'columnitem3' }]);
        price_total += beverage.price * beverage.quantity;
      });
      var dd = {
        defaultStyle: {
          font: 'Helvetica'
        },
        info: {
          title: 'Invoice',
          author: 'spectral369',
          subject: 'Beverange Invoice',
        },
        pageSize: 'A4',
        pageOrientation: 'portrait',
        footer: function (currentPage, pageCount) {
          return {
            table: {
              widths: ['*', 100],
              body: [
                [
                  { text: '©spectral369', link: 'https://freelancingpeter.eu', style: 'footer1' },
                  { text: 'Page ' + pageCount, alignment: 'right', style: 'footer2' }
                ]
              ]
            },
            layout: 'noBorders'
          };
        },
        content: [
        ], styles: {
          center1:
          {
            alignment: 'center',
            bold: true,
            fontSize: 18,
            color: 'black'
          },
          center2: {
            alignment: 'center',
            fontSize: 14,
            color: 'black'
          },
          tableHeader: {
            bold: true,
            fontSize: 14,
            color: 'black',
          },
          tableHeader2: {
            bold: true,
            fontSize: 14,
            color: 'black',
            alignment: 'center',
          },
          tableHeader3: {
            bold: true,
            fontSize: 14,
            color: 'black',
            alignment: 'right',
          },
          columnitem1: {
            alignment: 'justify',
          },

          columnitem2: {
            alignment: 'center',
          },
          columnitem3: {
            alignment: 'right',
          },
          total1: {
            bold: true,
            fontSize: 15,
            margin: [365, 5, 0, 15],
          },
          total2: {
            bold: true,
            fontSize: 16,
            decoration: 'underline'

          },
          footer1: {
            decoration: 'underline',
            alignment: 'center',
            margin: [105, 10, 0, 15],
          },
          footer2: {
            decoration: 'underline',
            alignment: 'center',
            margin: [0, 10, 50, 35],
          }
        }

      }
      var header = [{
        text: 'Chitanta/Invoice',
        style: 'center1'
      }];
      var sub_header = [{
        text: "No." + order_id + " / " + order_time.toISOString().replace(/T/, " ").replace(/\..+/, '') + "\n\n",
        style: 'center2'
      }];
      var total = [{
        style: 'total1',
        text: [
          { text: '\nTotal RON: ' }, { text: price_total, style: 'total2' }
        ]
      }];
      var qr = [{
        qr: 'diggdolma.com',
        style: {
          alignment: 'center'
        }
      }];
      var table2 = [{

        columns: [
          { width: '*', text: '' },
          {
            width: 'auto',

            table: {
              headerRows: 1,

              widths: [200, 50, 100],
              body: content_bev
            },
            layout: 'headerLineOnly',
          },

          { width: '*', text: '' },
        ]

      }];
      dd.content.push(header);
      dd.content.push(sub_header);
      dd.content.push(table2);
      dd.content.push(total);
      dd.content.push(qr);
      var pdfDoc = printer.createPdfKitDocument(dd);
      //var pdf_name = 'pdfs/doc_'+generateRandomString(10)+'.pdf';
      //pdfDoc.pipe(fs.createWriteStream(pdf_name));
      //pdfDoc.end();

      //var file = fs.createReadStream('pdfs/doc2Tgre4013G.pdf');
      //var stat = fs.statSync('pdfs/doc2Tgre4013G.pdf');
      //res.setHeader('Content-Length', stat.size);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
      //file.pipe(res);
      pdfDoc.pipe(res);
      pdfDoc.end();

    } else {
      res.send("N/A");
      res.end();
    }
  });

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
