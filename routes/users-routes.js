const express    = require('express');
const mongoose   = require('mongoose');
const User       = require('../models/user-model');
const passport   = require('passport');
const bcrypt     = require('bcrypt');
const router     = express.Router();


// //Create new user and add them to the database////////////////////////////////////
// router.post('/signup', (req, res, next) => {
//   const email = req.body.email; //email from the user model (schema) = email from the form that user fills
//   const password = req.body.password; //password from form.
//
//   if(!email || !password) {
//     res.status(400).json({ message: 'Provide email and password'});
//     return ;
//   }
//   //See if the email is already taken(query the database)
//   User.findOne({ email : email}, '_id', (err, foundUser) => {
//     if(foundUser) {
//       res.status(400).json({message: 'That email already exists.'});
//       return ;
//     }
//     //save the user to the database if its avalible
//     const salt = bcrypt.genSaltSync(10);
//     const hashPass = bcrypt.hashSync(password, salt);
//
//     const newUser = new User({
//       email: email,
//       password: hashPass
//     });
//     newUser.save((err) => {
//       if (err) {
//         res.status(500).json({message: 'something went wrong'});
//         return;
//       }
//       req.login(newUser, (err) => {
//         res.status(200).json(newUser);
//         return ;
//       });
//     });//theUser.save
//   });//user.findOne()
// });//Post/signup
router.post('/signup', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).json({ message: 'Provide email and password' });
    return;
  }

  User.findOne({ email }, '_id', (err, foundUser) => {
    if (foundUser) {
      res.status(400).json({ message: 'The email already exists' });
      return;
    }

    const salt     = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const theUser = new User({
      email,
      password: hashPass
    });

    theUser.save((err) => {
      if (err) {
        res.status(500).json({ message: 'Something went wrong' });
        return;
      }

      req.login(theUser, (err) => {
        if (err) {
          res.status(500).json({ message: 'Something went wrong' });
          return;
        }
        res.status(200).json(req.user);
      });
    });
  });
});

// //Log in an existing user//////////////////////////////////////////////////////////
// router.post('/login', (req, res, next) => {
//   const email = req.body.email;
//   const password = req.body.password;
//
//   //see if the email credential is saveUninitialized
//   User.findOne({email:email}, (err, foundUser) => {
//     //send error if no user with that email
//     if (foundUser === null){
//       res.status(400).json({message: 'Incorrect email'});
//       return;
//     }
//     //send an error if password is wrong
//     if(!bcrypt.compareSync(password, foundUser.password)) {
//       res.status(400).json({ message: 'Incorrect password'});
//       return;
//     }
//     //if we get here we are good and log in user
//     req.login(foundUser, (err) => {
//       res.status(200).json(foundUser);
//     });
//   });//User.findOne()
// });//Post/login

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
    if (err) {
      res.status(500).json({ message: 'Something went wrong' });
      return;
    }

    if (!theUser) {
      res.status(401).json(failureDetails);
      return;
    }

    req.login(theUser, (err) => {
      if (err) {
        res.status(500).json({ message: 'Something went wrong' });
        return;
      }

      // We are now logged in (notice req.user)
      res.status(200).json(req.user);
    });
  })(req, res, next);
});

//Log out an existing user//////////////////////////////////////////////////////
router.post('/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({ message: 'Success' });
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
