// const LocalStrategy = require('passport-local').Strategy;
// const User          = require('../models/user-model');
// const bcrypt        = require('bcrypt');
// const passport      = require('passport');
//
// module.exports = function (passport) {
//
//   passport.use(new LocalStrategy((username, password, next) => {
//     User.findOne({ username }, (err, foundUser) => {
//       if (err) {
//         next(err);
//         return;
//       }
//
//       if (!foundUser) {
//         next(null, false, { message: 'Incorrect username' });
//         return;
//       }
//
//       if (!bcrypt.compareSync(password, foundUser.password)) {
//         next(null, false, { message: 'Incorrect password' });
//         return;
//       }
//
//       next(null, foundUser);
//     });
//   }));
//
//   passport.serializeUser((loggedInUser, cb) => {
//     cb(null, loggedInUser._id);
//   });
//
//   passport.deserializeUser((userIdFromSession, cb) => {
//     User.findById(userIdFromSession, (err, userDocument) => {
//       if (err) {
//         cb(err);
//         return;
//       }
//
//       cb(null, userDocument);
//     });
//   });
// };
//
const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;


const User = require('../models/user-model');


// Save the user's ID in the bowl (called when user logs in)
passport.serializeUser((loggedInUser, cb) => {
    cb(null, loggedInUser._id);
});


// Retrieve the user's info from the DB with the ID we got from the bowl
passport.deserializeUser((userIdFromSession, cb) => {
    User.findById(
      userIdFromSession,
      (err, userDocument) => {
        if (err) {
          cb(err);
          return;
        }
        cb(null, userDocument);
      }
    );
});
