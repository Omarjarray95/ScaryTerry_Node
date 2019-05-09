var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var entreprisesRouter = require('./routes/entreprises');

var meetingRouter = require('./routes/meetings');
var chatbotRouter = require('./routes/dialogFlowRoutes');
var meetingnotecriteriaRouter = require('./routes/meetingnotecriterias');
var impedimentRouter = require('./routes/impediments');
var fieldsRouter = require('./routes/fields');
var skillsRouter = require('./routes/skills');
var programsRouter = require('./routes/programs');
var projectsRouter = require('./routes/projects');
var productBacklogsRouter = require('./routes/productBacklogs');
var itemsRouter = require('./routes/Items');
var sprintsRouter = require('./routes/sprints');
var userStoriesRouter = require('./routes/userStories');
var MeetingNoteRouter = require('./routes/meetingnotes');


var evaluationRouter = require('./routes/evaluation');
var motivationRouter = require('./routes/MotivationRoutes');
var absenteeismRouter = require('./routes/AbsenteeismRoutes');
var communicationRouter = require('./routes/CommunicationRoutes');
var performanceRouter = require('./routes/PerformanceRoutes');

var applicationRouter = require('./routes/applications');
var applierRouter = require('./routes/appliers');
var contractRouter = require('./routes/contracts');
var seniorityRouter = require('./routes/seniorities');
var quizRouter = require('./routes/quiz');
var codeRouter = require('./routes/code');
var testRecruitmentRouter = require('./routes/testRecruitment');
var jobOfferRouter = require('./routes/joboffers');
var jobsRouter = require('./routes/jobs');
var trainingRouter = require('./routes/training');

var mongoose = require('mongoose');
//const url = "mongodb+srv://OmarJarray95:loulou95@scrummy0-po95q.mongodb.net/scrummy?retryWrites=true";
const url = "mongodb://localhost:27017/scrummy";
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
app.use('/eval', evaluationRouter);
app.use('/entreprises', entreprisesRouter);

app.use('/meetings', meetingRouter);
app.use('/meeting/criterias', meetingnotecriteriaRouter);
app.use('/impediments', impedimentRouter);
app.use('/chatbot', chatbotRouter);
app.use('/fields', fieldsRouter);
app.use('/skills', skillsRouter);
app.use('/programs', programsRouter);
app.use('/projects', projectsRouter);
app.use('/productbacklogs', productBacklogsRouter);
app.use('/items', itemsRouter);
app.use('/sprints', sprintsRouter);
app.use('/userstories', userStoriesRouter);
app.use('/meeting/rate', MeetingNoteRouter);


app.use('/motivation', motivationRouter);
app.use('/absenteeism', absenteeismRouter);
app.use('/communication', communicationRouter);
app.use('/performance', performanceRouter);

app.use('/applications', applicationRouter);
app.use('/appliers', applierRouter);
app.use('/contracts', contractRouter);
app.use('/seniorities', seniorityRouter);
app.use('/quiz', quizRouter);
app.use('/codes', codeRouter);
app.use('/tests', testRecruitmentRouter);
app.use('/offers', jobOfferRouter);
app.use('/jobs',jobsRouter);
app.use('/training',trainingRouter);

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
