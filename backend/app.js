var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
const cors=require('cors')
var registrationRouter = require('./routes/registration');
var usersRouter = require('./routes/users');
const { log } = require('console');
require('dotenv').config()
var app = express();

const start = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URL
    );
     console.log(" Mongoose is connected")
  } catch (error) {
    console.error(error);
  }
};
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection failed: "));
db.once("open",()=>{console.log("Connected to DB")})

start().catch(console.dir);
app.use(cors());
console.log("jaua")
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/registration', registrationRouter);
app.use('/api/user', usersRouter);

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
