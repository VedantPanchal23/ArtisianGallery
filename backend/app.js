require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var artworksRouter = require('./routes/artworks');
var ordersRouter = require('./routes/orders');
var adminRouter = require('./routes/admin');
var { testEmailConfig } = require('./utils/emailService');

var app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/arthive').then(() => {
  console.log('Connected to MongoDB');
  
  // Test email configuration on startup
  testEmailConfig()
    .then(function(isConfigured) {
      if (isConfigured) {
        console.log('✅ Email service is ready for production use');
      } else {
        console.log('⚠️ Email service not configured - will use console logging');
      }
    })
    .catch(function(error) {
      console.error('❌ Email service test failed:', error);
    });
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// CORS middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/artworks', artworksRouter);
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
