var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var session = require('express-session');
var hbs = require('hbs');
const fileUpload = require('express-fileupload');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/send');
var bartenderRouter = require('./routes/bartender');
var adminRouter = require('./routes/admin');

var app = express();
app.use(session({
  secret: 'Digg_fuckers',
  resave: true,
  rolling: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: true, //aici va fi true pe host(pentru ca necesita certificat https !!!!)
    maxAge: 60 * 60 * 60,
    sameSite: 'lax'
  }
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.json())
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());



app.use('/', indexRouter);
app.use('/send', usersRouter);
app.use('/bartender', bartenderRouter);
app.use('/admin', adminRouter);


hbs.registerHelper('equals', function (conditional, value, options) {
  if (conditional === value) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
})



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//app.set('trust proxy', 1) // trust first proxy

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
