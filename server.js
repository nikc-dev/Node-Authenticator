
// The Entire App is coded in this single file, instead of creating a seperate
// file for each type (Routes / Passport / Database / Etc ) to make it easily readable for you!

var express = require('express');
var app = express();
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Path To HTML, CSS Folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(session({
  "secret": "thisisasecret",
  "saveUninitialized": true,
  "resave": true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// The User Details is currently saved here since my MySql experience is less.
// Use the following usernames and pass to login from browser!
var usersData = [{
    "userName": "Nik",
    "pass": "nikil"
  },
  {
    "userName": "Vimal",
    "pass": "vimal"
  },
  {
    "userName": "Rajesh",
    "pass": "rajesh"
  }
];


// To start the server, open Termianl in the folder Node-Authenticator and
// run $ npm install to install dependencies and then use $ node server.js to start the server.
// Use http://localhost:3000/login on Browser After Starting Server

// Handling Get Request For /Login Page. Responds the HTML Page with CSS
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/login.html'));
});

// The Succes Message is only displayed if the user is logged in and an active Session is Present.
// Accessing http://localhost:3000/success without loging-in first will give an Unauthorized Message. (Session Functionality)
app.get('/success', (req, res) => {
  if (req.user) {
    res.send("You Have Been Succesfully Logged In! </br> Session Active! </br> Kill Server In Terminal To LogOut User! </br> This page wont be accessible without Active Login Session! ");
  } else {
    res.send("Unauthorized </br> login here first:</br>http://localhost:3000/login </br>  to view this page!");
  }

});

passport.use(new LocalStrategy(
  function(username, password, done) {
    // Going through the UsersData Array to see if Matching User and Pass is Available.
    var userFound = false;
    for (var i = 0; i < usersData.length; i++) {
      var usr = usersData[i];
      if (usr.userName === username) {
        userFound = true;
        console.log("User Found");
        if (usr.pass === password) {
          console.log("Password Approved");
          passport.serializeUser(function(usr, done) {
            done(null, usr.userName);
            console.log("User Serialized For Session");
          });

          passport.deserializeUser(function(id, done) {
            done(null, usr);
            });

          return done(null, usr);
          break;
        } else {
          console.log("Incorrect Password");
          return done(null, false, {
            message: 'Incorrect Password'
          });
          break;
        }
      }
    }
    if (!userFound) {
      console.log("User Does Not Exist");
      return done(null, false, {
        message: 'Incorrect username.'
      });
    }
    // Logic to query user and password from MySql is to be added here instead of the above code.
    // I need a little time to get my head around MySql still.
  }
));

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/success',
    failureRedirect: '/login',
    failureFlash: true
  })
);

app.listen(3000, () => {
  console.log("Node Server Running On Port 3000. Use localhost:3000/login in your browser to login!");
})
