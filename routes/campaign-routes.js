const express  = require('express');
const mongoose = require('mongoose');
const Campaign = require('../models/campaign-model');
const router   = express.Router();

//Create a new campaign///////////////////////////////////////////////////////////////
router.post('/create', (req, res, next) => {
  const theCampaign = new Campaign({
    title: req.body.title,
    image: req.body.image,
    summary: req.body.summary,
    goal: req.body.goal,
    organizations: req.body.organizations,
    events:req.body.events,
    donations: req.body.donations,
    active: req.body.active,
  });
  theCampaign.save((err => {
    if(err) {
      res.json(err);
      return;
    }
    res.json({
      message: 'New Campaign Created',
      theCampaign
    });
  }));
});

//Return all campaigns///////////////////////////////////////////////////////////////
router.get('/findAll', (req, res, next) => {
  Campaign.find((err, campaignList) => {
    if(err){
      res.json(err);
      return;
    }
    res.json(campaignList);
  });//Campaign.find();
});//get/findAllCampaigns

//Return a single campaign////////////////////////////////////////////////////////
router.get('/findOne:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Campaign.findById(req.params.id, (err, theCampaign) => {
      if (err) {
        res.json(err);
        return;
      }

      res.json(theCampaign);
    });
});

//Edit an existing campaign/////////////////////////////////////////////////////
router.put('/update:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  const updates = {
    title: req.body.title,
    image: req.body.image,
    summary: req.body.summary,
    goal: req.body.goal,
    organizations: req.body.organizations,
    events:req.body.events,
    donations: req.body.donations,
    active: req.body.active,
  };

  Campaign.findByIdAndUpdate(req.params.id, updates, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: 'Campaign updated successfully',
      updates
    });
  });
});

//Delete a Campaign//////////////////////////////////////////////////////////////
router.delete('/delete/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Campaign.remove({ _id: req.params.id }, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    return res.json({
      message: 'Campaign has been removed!'
    });
  });
});


module.exports = router;
