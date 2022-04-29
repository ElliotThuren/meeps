const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const nunjucks = require('nunjucks');
const session = require('express-session');

require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const meepsRouter = require('./routes/meeps');

const app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'jaggillarfrukttårta',
    resave: false,
    saveUninitialized: true,
    cookie: { sameSite: true }
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/meeps', meepsRouter);

module.exports = app;