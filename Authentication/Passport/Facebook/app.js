var express = require('express');
var app = express();
var bodyParser = require ('body-parser');
var session = require('express-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook');
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(session({
secret:'Mrunal',
resave:true,
saveUninitialized:true
}));

var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: "438354146970535",
    clientSecret: "87ac3770c705d6c853b8b0e0521d149e",
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    if (profile) {
        user = profile;
        return done(null, user);
        }
        else {
        return done(null, false);
        }
    /* User.findOrCreate({ facebookId: profile.id }, function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    }); */
  }
));
app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });   
  app.route('/').get(function(req,res){
    res.send('successfully route')
  });
passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  app.listen(3000)