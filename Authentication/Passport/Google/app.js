// Required dependencies 
const express = require('express');
const app = express();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const cookieSession = require('cookie-session');
app.set('view engine','ejs');
let fileScope;
// cookieSession config
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
    keys: ['randomstringhere']
}));

app.use(passport.initialize()); // Used to initialize passport
app.use(passport.session()); // Used to persist login sessions

// Strategy config
passport.use(new GoogleStrategy({
        clientID: '995831726881-ujnao6rt84k89up93p22motq9vrjel2n.apps.googleusercontent.com',
        clientSecret: '0XM1w_8J21J6QC4qU5gNxiTf',
        callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
        done(null, profile); // passes the profile data to serializeUser
    }
));

// Used to stuff a piece of information into a cookie
passport.serializeUser((user, done) => {
    fileScope = user;
    done(null, user);
});

// Used to decode the received cookie and persist session
passport.deserializeUser((user, done) => {
    console.log(user);
    done(null, user);
});

// Middleware to check if the user is authenticated
function isUserAuthenticated(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.send('You must login!');
    }
}

// Routes
app.get('/', (req, res) => {
    res.render('index.ejs');
});

// passport.authenticate middleware is used here to authenticate the request
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile'] // Used to specify the required data
}));

// The middleware receives the data from Google and runs the function on Strategy config
app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('/secret');
});

// Secret route
app.get('/secret', isUserAuthenticated, (req, res) => {
    //res.send([fileScope.displayName,fileScope.photos[0].value,fileScope.provider]);
    var img = `${fileScope.photos[0].value}`;
    var someHTML = `<img src=${img} alt='Italian Trulli' width="100" height="100">`;
    //res.write('<h1>HEllo</h1>');
    //res.send(someHTML);//,[fileScope.displayName,fileScope.provider]);
    res.render('profile',{fileScope:fileScope.displayName,image:img}); 
});

// Logout route
app.get('/logout', (req, res) => {
    req.logout(); 
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('Server Started!');
});