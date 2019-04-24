var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var entreprisesRouter = require('./routes/entreprises');
var applicationRouter = require('./routes/applications');
var applierRouter = require('./routes/appliers');
var contractRouter = require('./routes/contracts');
var seniorityRouter = require('./routes/seniorities');
var quizRouter = require('./routes/quiz');
var codeRouter = require('./routes/code');
var testRecruitmentRouter = require('./routes/testRecruitment');
var jobOfferRouter = require('./routes/joboffers');

var mongoose = require('mongoose');
const url = "mongodb+srv://OmarJarray95:loulou95@scrummy0-po95q.mongodb.net/scrummy?retryWrites=true";
// const url = "mongodb://localhost:27017/scrummy";
mongoose.connect(url, { useNewUrlParser: true });
mongoose.set({ usecreateIndexes: true });
var mongo = mongoose.connection;
mongo.on('connected', () => { console.log('Connected !') });
mongo.on('open', () => { console.log('Open !') });
mongo.on('error', (err) => { console.log(err) });

var cors = require('cors');

var app = express();

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/entreprises', entreprisesRouter);
app.use('/applications', applicationRouter);
app.use('/appliers', applierRouter);
app.use('/contracts', contractRouter);
app.use('/seniorities', seniorityRouter);
app.use('/quiz', quizRouter);
app.use('/codes', codeRouter);
app.use('/tests', testRecruitmentRouter);
app.use('/offers', jobOfferRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

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
