'use strict';

var morgan         = require('morgan'),
    bodyParser     = require('body-parser'),
    methodOverride = require('express-method-override'),
    less           = require('less-middleware'),
    session        = require('express-session'),
    RedisStore     = require('connect-redis')(session),
    flash          = require('connect-flash'),
    passport       = require('passport'),
    passportConfig = require('../lib/passport/passportConfig'),
    security       = require('../lib/security'),
    debug          = require('../lib/debug'),
    home           = require('../controllers/home'),
    users          = require('../controllers/users');

module.exports = function(app, express){
  app.use(morgan('dev'));
  app.use(less(__dirname + '/../static'));
  app.use(express.static(__dirname + '/../static'));
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(methodOverride());
  app.use(session({store:new RedisStore(), secret:'my super secret key', resave:true, saveUninitialized:true, cookie:{maxAge:null}}));
  app.use(flash());
  passportConfig(passport, app);

  //authentication
  app.use(security.locals);
  app.use(debug.info);

  //guest user access
  app.get('/', home.index);
  app.get('/register', users.new);
  app.post('/register', users.create);
  app.get('/login', users.login);
  app.post('/login', passport.authenticate('local',   {successRedirect:'/', failureRedirect:'/login', successFlash:'Successful Local Login!',   failureFlash:'Sorry, your local login was incorrect.'}));
  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback', passport.authenticate('twitter',  {successRedirect:'/', failureRedirect:'/login', successFlash:'Twitter got you in!', failureFlash:'Sorry, your Twitter login did not work'}));
  app.get('/auth/google', passport.authenticate('google',             {scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read']}));
  app.get('/auth/google/callback', passport.authenticate('google',    {successRedirect:'/', failureRedirect:'/login', successFlash:'Google got you in!',  failureFlash:'Sorry, your Google login did not work'}));
  app.get('/auth/facebook', passport.authenticate('facebook'));
  app.get('/auth/facebook/callback', passport.authenticate('facebook',  {successRedirect:'/', failureRedirect:'/login', successFlash:'Facebook got you in!', failureFlash:'Sorry, your Facebook login did not work'}));
  app.get('/messages', users.messages);
  app.get('/messages/:msgId', users.message);

  //security
  app.use(security.bounce);

  //logged in user access
  app.delete('/logout', users.logout);
  app.get('/users/edit', users.edit);
  app.put('/users/edit', users.update);
  app.get('/browse', users.browse);

  app.get('/farm/users/:userId', users.displayProfile);
  app.post('/user/:toId/wag', users.wag);
  app.post('/user/:lickee/lick', users.lick);

  console.log('Express: Routes Loaded');
};

