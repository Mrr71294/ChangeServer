const express  = require('express');
const mongoose = require('mongoose');
const Event    = require('../models/event-model');
const router   = express.Router();

//Create a event////////////////////////////////////////////////////////////////
router.post('/event', (req, res, next) => {
  const theEvent = new Event({
    title: req.body.title,
    image: req.body.image,
    summary: req.body.summary,
    evenrtDate: req.body.eventDate,
    duration: req.body.duration,
    eventHead: req.body.eventHead,
    address: req.body.address,
    });
  theEvent.save((err => {
    if(err) {
      res.json(err);
      return;
    }
    res.json({
      message: 'New Event Created',
      id: theEvent._id
    });
  }));
});

//Return all events///////////////////////////////////////////////////////////////
router.get('/findAll', (req, res, next) => {
  Event.find((err, eventList) => {
    if(err){
      res.json(err);
      return;
    }
    res.json(eventList);
  });//Event.find();
});//get/findAllEvents

//Return a single event////////////////////////////////////////////////////////
router.get('/event/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Event.findById(req.params.id, (err, theEvent) => {
      if (err) {
        res.json(err);
        return;
      }

      res.json(theEvent);
    });
});

//Edit an existing event/////////////////////////////////////////////////////
router.put('/event/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  const updates = {
    title: req.body.title,
    image: req.body.image,
    summary: req.body.summary,
    evenrtDate: req.body.eventDate,
    duration: req.body.duration,
    eventHead: req.body.eventHead,
    address: req.body.address,
  };

  Event.findByIdAndUpdate(req.params.id, updates, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: 'Event updated successfully'
    });
  });
});

//Delete a Event//////////////////////////////////////////////////////////////
router.delete('/event/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Event.remove({ _id: req.params.id }, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    return res.json({
      message: 'Event has been removed!'
    });
  });
});



module.exports = router;
