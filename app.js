const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const config = require('./config/database');

require('./controllers/googleAuth')(passport);

const port = process.env.PORT || 3000;

mongoose.connect(config.database);
let db = mongoose.connection;

db.once('open', () => console.log('Connected to MongoDB.'));  // connect to db
db.on('error', (err) => console.log(err));  // check for db errors

let Order = require('./models/order');  // bring in order model

const app = express();  // init app
app.use(express.static(__dirname + '/views'));  // load views
app.use(express.static(__dirname + '/public'));  // define public folder
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.set('view engine', 'ejs');  // set view engine to ejs

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// express session
app.use(session({
  secret: 'hehe',
  resave: false,
  saveUninitialized: true,
  cooke: { secure: true }
}));

// passport config
require('./controllers/googleAuth')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// home route
app.get('/', (req, res) => {
  res.render('index', { title: 'UH AEVS Delivery System' });
});

let user = require('./routes/user');

app.use('/user', user);

// start server
app.listen(port, () => console.log(`Server started on port ${port}.`));
