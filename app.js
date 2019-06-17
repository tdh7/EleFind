var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Auth
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;


var indexRouter = require('./routes/index');
var cartRouter = require('./routes/cart');
var checkoutRouter = require('./routes/checkout');
var accountRouter = require('./routes/account_manage');
var historyOrder = require('./routes/history_order');
var productRouter = require('./routes/product');

const User = require('./models/user');

passport.use(new LocalStrategy({usernameField:'email'},
    async function (username, password, done) {
      try {
        const user = await User.get(username);
        if (!user) {
          return done(null, false, {message: 'Incorrect username.'});
        }
        const isPasswordValid = await User.validPassword(username, password);
        if (!isPasswordValid) {
          return done(null, false, {message: 'Incorrect password.'});
        }
        return done(null, user);
      }catch (e) {
        return done(e);
      }
    }));
passport.serializeUser(function (user,done) {
  done(null,user.email);
});

passport.deserializeUser(async function (email,done) {
  const user = await User.get(email);
  done(undefined,user);
});


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

var exphbs = require('express-handlebars');
var hbsHelpers = exphbs.create({
  helpers: require("./helpers/handlebars.js").helpers,
  defaultLayout: 'layout',
  extname: '.hbs'
});

app.engine('.hbs', hbsHelpers.engine);
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret:'trungtuantu',resave:true,saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());



app.use('/', indexRouter);
app.use('/san-pham',productRouter);
app.use('/gio-hang',cartRouter);
app.use('/thanh-toan',checkoutRouter);
app.use('/lich-su-mua-hang',historyOrder);
app.use('/tai-khoan',accountRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.log('error : '+err.message);
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { customStyleSheet:'stylesheets/error.css' });
});

module.exports = app;
