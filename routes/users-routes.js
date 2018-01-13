const express    = require('express');
const mongoose   = require('mongoose');
const User       = require('../models/user-model');
const passport   = require('passport');
const bcrypt     = require('bcrypt');
const router     = express.Router();


// //Create new user and add them to the database////////////////////////////////////
router.post('/signup', (req, res, next) => {

  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  //if nothing entered, promt an entry.
  if (!email || !password) {
    res.status(400).json({message: 'Provide the email and password.'});
    return;
  }

  // See if the user is already taken (query the database)
  User.findOne({ email: email }, '_id', (err, foundUser) => {
    if (foundUser){
      res.status(400).json({message: 'The email already exists. Try another one.'});
      return;
    }
    //hash the password and assign email and hashpass to theUser object.
    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);
    const theUser = new User({
      email: email,
      password: hashPass,
      name : name
    });
    //Save to the database and return a message on error.
    theUser.save((err) => {
      if (err){
        res.status(500).json({message: 'Opps, something went wrong when creating your account, please try agian.'});
        return;
      }
      // Logins the user after successful account creation
      req.login(theUser, (err) => {
        if (err){
          res.status(500).json({message: 'Opps, something went wrong. Please try again.'});
          return;
        }
        theUser.password = undefined; // Hides user's password from response. Only shows in database.
        res.status(200).json(theUser); // Displays the user acount info in a server 200 res
      });
    }); // closes theUser.save()
  }); // closes User.findOne()
}); // closes GET /signup

// //Log in an existing user//////////////////////////////////////////////////////////
router.post('/login', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // query accounts by email entered
  User.findOne({email: email}, (err, foundUser) => {
    // if no email or password entered, promt user to enter info.
    if (!email || !password ){
      res.status(400).json({message: 'Please make sure all required fields are filled out correctly.'});
      return;
    }
    //check if email exists and send message if already taken.
    if (!foundUser) {
      res.status(400).json({message: 'Email entered does not exist in the database. Please try a different email or sign up for a new account.'});
      return;
    }
    // checks if user's entered password matches the password encrypted with the foundUser
    if (!bcrypt.compareSync(password, foundUser.password)) {
      res.status(400).json({message: 'Incorrect password.'});
      return;
    }

    // log the user in
    req.login(foundUser, (err) => {
       // hides the bcrypt password so it doenst return in the response
      foundUser.password = undefined;
      // res.status(200).json({message: 'Log in successful!'});
      res.status(200).json(foundUser);
      return;
    });//req.login()
  }); // User.findOne()
});// POST /login

//Log out an existing user//////////////////////////////////////////////////////
router.post('/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({ message: 'Success' });
});

router.get('/checklogin', (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ message: 'Nobody logged in. 🥒' });
      return;
    }

    // Clear the encryptedPassword before sending
    // (not from the database, just from the object)
    req.user.encryptedPassword = undefined;

    res.status(200).json(req.user);
});

//Return all users///////////////////////////////////////////////////////////////
router.get('/findAll', (req, res, next) => {
  User.find((err, userList) => {
    if(err){
      res.json(err);
      return;
    }
    res.json(userList);
  });//User.find();
});//get/findAllUsers

//return a single user//////////////////////////////////////////////////////////
router.get('/user/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  User.findById(req.params.id, (err, theUser) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json(theUser);
  });
});

//Edit an existing user/////////////////////////////////////////////////////
router.put('/user/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  const updates = {
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };

  User.findByIdAndUpdate(req.params.id, updates, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: 'User updated successfully'
    });
  });
});

//Delete a User//////////////////////////////////////////////////////////////
router.delete('/user/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  User.remove({ _id: req.params.id }, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    return res.json({
      message: 'User has been removed!'
    });
  });
});


module.exports = router;
